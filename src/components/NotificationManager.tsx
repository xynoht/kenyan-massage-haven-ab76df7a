
import { useToast } from "@/hooks/use-toast";

interface NotificationData {
  type: 'booking' | 'contact' | 'voucher';
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  details: any;
}

export const useNotificationManager = () => {
  const { toast } = useToast();

  const sendCustomerNotification = (data: NotificationData) => {
    let message = '';
    let title = '';

    switch (data.type) {
      case 'booking':
        title = 'Booking Received!';
        message = `Thank you ${data.customerName}! Your massage booking has been received. We'll confirm your appointment shortly via ${data.customerPhone}.`;
        break;
      case 'contact':
        title = 'Message Received!';
        message = `Thank you ${data.customerName}! We've received your message and will get back to you soon at ${data.customerPhone}.`;
        break;
      case 'voucher':
        title = 'Gift Voucher Request Received!';
        message = `Thank you ${data.customerName}! Your gift voucher request has been received. We'll process it and contact you at ${data.customerPhone}.`;
        break;
    }

    // Show notification to customer
    toast({
      title,
      description: message,
      duration: 8000,
    });

    // Log for admin reference
    console.log('Customer notification sent:', {
      type: data.type,
      customer: data.customerName,
      phone: data.customerPhone,
      email: data.customerEmail,
      details: data.details,
      timestamp: new Date().toISOString(),
      message
    });

    return { success: true, message };
  };

  const sendAdminNotification = (data: NotificationData) => {
    let adminMessage = '';

    switch (data.type) {
      case 'booking':
        adminMessage = `New booking: ${data.customerName} (${data.customerPhone}) - ${data.details.date} at ${data.details.time}`;
        break;
      case 'contact':
        adminMessage = `New contact message from ${data.customerName} (${data.customerPhone})`;
        break;
      case 'voucher':
        adminMessage = `New gift voucher request: ${data.customerName} (${data.customerPhone}) - KSh ${data.details.amount}`;
        break;
    }

    // In a real implementation, this would send to admin dashboard or email
    console.log('Admin notification:', {
      type: data.type,
      message: adminMessage,
      customerData: data,
      timestamp: new Date().toISOString()
    });

    return { success: true, message: adminMessage };
  };

  return {
    sendCustomerNotification,
    sendAdminNotification
  };
};
