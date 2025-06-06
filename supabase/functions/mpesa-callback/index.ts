
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const callbackData = await req.json();
    console.log('M-Pesa callback received:', JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    if (!Body || !Body.stkCallback) {
      console.error('Invalid callback format');
      return new Response('OK', { status: 200 });
    }

    const { stkCallback } = Body;
    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = stkCallback;

    console.log('Processing callback for:', CheckoutRequestID, 'Result:', ResultCode);

    // Update transaction status
    const updateData: any = {
      result_code: ResultCode,
      result_desc: ResultDesc,
      status: ResultCode === 0 ? 'completed' : 'failed'
    };

    // If payment was successful, extract additional details
    if (ResultCode === 0 && CallbackMetadata && CallbackMetadata.Item) {
      const metadata = CallbackMetadata.Item;
      
      // Extract payment details from metadata
      const amountItem = metadata.find((item: any) => item.Name === 'Amount');
      const receiptItem = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber');
      const dateItem = metadata.find((item: any) => item.Name === 'TransactionDate');
      const phoneItem = metadata.find((item: any) => item.Name === 'PhoneNumber');

      if (amountItem) updateData.amount = parseFloat(amountItem.Value);
      if (receiptItem) updateData.mpesa_receipt_number = receiptItem.Value;
      if (phoneItem) updateData.phone_number = phoneItem.Value.toString();
      if (dateItem) {
        // Convert M-Pesa date format (YYYYMMDDHHmmss) to ISO string
        const dateStr = dateItem.Value.toString();
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const hour = dateStr.substring(8, 10);
        const minute = dateStr.substring(10, 12);
        const second = dateStr.substring(12, 14);
        updateData.transaction_date = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
      }
    }

    // Update M-Pesa transaction record
    const { data: mpesaTransaction, error: mpesaError } = await supabase
      .from('mpesa_transactions')
      .update(updateData)
      .eq('checkout_request_id', CheckoutRequestID)
      .select()
      .single();

    if (mpesaError) {
      console.error('Error updating M-Pesa transaction:', mpesaError);
      return new Response('OK', { status: 200 });
    }

    console.log('Updated M-Pesa transaction:', mpesaTransaction);

    // If payment was successful, update the related booking or gift voucher
    if (ResultCode === 0 && mpesaTransaction) {
      const { reference_id, transaction_type } = mpesaTransaction;

      if (transaction_type === 'booking') {
        // Update booking status
        const { error: bookingError } = await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', reference_id);

        if (bookingError) {
          console.error('Error updating booking status:', bookingError);
        } else {
          console.log('Booking confirmed:', reference_id);
        }

        // Update payment transaction
        const { error: paymentError } = await supabase
          .from('payment_transactions')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString(),
            transaction_id: updateData.mpesa_receipt_number 
          })
          .eq('reference_id', reference_id)
          .eq('transaction_type', 'booking');

        if (paymentError) {
          console.error('Error updating payment transaction:', paymentError);
        }

      } else if (transaction_type === 'gift_voucher') {
        // Update gift voucher payment status
        const { error: voucherError } = await supabase
          .from('gift_vouchers')
          .update({ payment_status: 'completed' })
          .eq('id', reference_id);

        if (voucherError) {
          console.error('Error updating gift voucher status:', voucherError);
        } else {
          console.log('Gift voucher payment completed:', reference_id);
        }

        // Update payment transaction
        const { error: paymentError } = await supabase
          .from('payment_transactions')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString(),
            transaction_id: updateData.mpesa_receipt_number 
          })
          .eq('reference_id', reference_id)
          .eq('transaction_type', 'gift_voucher');

        if (paymentError) {
          console.error('Error updating payment transaction:', paymentError);
        }
      }
    }

    // Always return OK to M-Pesa
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Error in mpesa-callback function:', error);
    return new Response('OK', { status: 200 });
  }
});
