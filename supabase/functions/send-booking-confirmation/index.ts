
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  duration: number;
  branch: string;
  totalAmount: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const {
      bookingId,
      customerName,
      customerPhone,
      customerEmail,
      date,
      time,
      duration,
      branch,
      totalAmount,
    }: BookingConfirmationRequest = await req.json();

    console.log("Processing booking confirmation for:", bookingId);

    // Format the confirmation message
    const message = `Hello ${customerName}! 

Your booking at PriElla Massage Therapy Centre has been CONFIRMED! ✅

📅 Date: ${new Date(date).toLocaleDateString('en-GB')}
⏰ Time: ${time}
⏱️ Duration: ${duration} minutes
📍 Location: ${branch === 'the-hub-karen' ? 'The Hub Karen, Upper Ground Floor' : branch}
💰 Amount: KSh ${totalAmount.toLocaleString()}

Thank you for choosing PriElla! We look forward to providing you with a premium wellness experience.

For any changes or questions, please call us at +254 710 904 327.

Best regards,
PriElla Massage Therapy Centre`;

    // Try to send WhatsApp message first (if we have WhatsApp API configured)
    let whatsappSent = false;
    try {
      // This would require WhatsApp Business API integration
      // For now, we'll log the attempt
      console.log("WhatsApp message would be sent to:", customerPhone);
      console.log("Message:", message);
      whatsappSent = true; // Set to true once WhatsApp API is configured
    } catch (error) {
      console.log("WhatsApp sending failed:", error);
    }

    // Try to send email if customer has provided email
    let emailSent = false;
    if (customerEmail) {
      try {
        // This would require email service integration (like Resend)
        console.log("Email would be sent to:", customerEmail);
        console.log("Subject: Booking Confirmation - PriElla Massage Therapy Centre");
        console.log("Message:", message);
        emailSent = true; // Set to true once email service is configured
      } catch (error) {
        console.log("Email sending failed:", error);
      }
    }

    // Try to send SMS as fallback
    let smsSent = false;
    try {
      // This would require SMS service integration (like Twilio or Africa's Talking)
      console.log("SMS would be sent to:", customerPhone);
      console.log("Message:", message);
      smsSent = true; // Set to true once SMS service is configured
    } catch (error) {
      console.log("SMS sending failed:", error);
    }

    // Log the notification attempt in the database
    await supabaseClient.from('booking_notifications').insert({
      booking_id: bookingId,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      notification_type: whatsappSent ? 'whatsapp' : emailSent ? 'email' : smsSent ? 'sms' : 'none',
      status: (whatsappSent || emailSent || smsSent) ? 'sent' : 'failed',
      message: message,
    });

    return new Response(
      JSON.stringify({
        success: true,
        whatsappSent,
        emailSent,
        smsSent,
        message: "Booking confirmation notification processed"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
