
import { Card, CardContent } from "@/components/ui/card";

const Refund = () => {
  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gold mb-4">Refund & Cancellation Policy</h1>
          <p className="text-xl text-gray-300">Last Updated: June 5, 2024</p>
        </div>
      </section>

      {/* Refund Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-800 border-gold/20">
            <CardContent className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl text-gold mb-4">1. Booking Cancellations</h2>
                <p className="text-gray-300 mb-4">
                  At Priella Massage Therapy Station, we understand that plans can change. Our cancellation policy is designed to be fair and transparent:
                </p>
                <ul className="list-disc pl-8 text-gray-300 space-y-2">
                  <li><strong>More than 24 hours notice:</strong> Full refund of the booking amount</li>
                  <li><strong>Less than 24 hours notice:</strong> 50% refund of the booking amount</li>
                  <li><strong>No-show:</strong> No refund will be provided</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">2. Rescheduling</h2>
                <p className="text-gray-300">
                  We are happy to reschedule your appointment with at least 12 hours notice at no additional cost, subject to availability. Rescheduling requests with less than 12 hours notice will be accommodated on a case-by-case basis and may incur a fee.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">3. Service Dissatisfaction</h2>
                <p className="text-gray-300 mb-4">
                  Your satisfaction is our priority. If you are not completely satisfied with your massage experience:
                </p>
                <ul className="list-disc pl-8 text-gray-300 space-y-2">
                  <li>Please inform us immediately at the end of your session</li>
                  <li>We will offer a complimentary session of equal duration</li>
                  <li>Refund requests due to dissatisfaction will be evaluated on a case-by-case basis</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">4. Gift Vouchers</h2>
                <p className="text-gray-300">
                  Gift vouchers are non-refundable once purchased but are transferable to another person. All vouchers are valid for 12 months from the date of purchase unless otherwise specified.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">5. Technical Issues</h2>
                <p className="text-gray-300">
                  In the rare event that we cannot provide your service due to technical issues or equipment malfunction, we will offer you the option of rescheduling your session or receiving a full refund.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">6. Health & Safety</h2>
                <p className="text-gray-300">
                  We reserve the right to refuse service if we believe the service may pose a health risk to the customer based on disclosed health conditions. In such cases, a full refund will be provided.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">7. Payment Processing</h2>
                <p className="text-gray-300">
                  Refunds will be processed through the same payment method used for the original transaction. Please allow 5-7 business days for the refund to be reflected in your account, depending on your payment provider.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">8. Special Circumstances</h2>
                <p className="text-gray-300">
                  We understand that emergencies happen. In case of medical emergencies or other exceptional circumstances, please contact us as soon as possible with supporting documentation. Refunds or rescheduling in such cases will be handled sympathetically.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">9. M-Pesa & Flutterwave Transactions</h2>
                <p className="text-gray-300">
                  For refunds on M-Pesa or Flutterwave transactions, please note that any transaction fees charged by these services are non-refundable. Only the service amount will be refunded according to our policy.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">10. Contact for Refunds</h2>
                <p className="text-gray-300">
                  To request a refund or discuss cancellations, please contact us at tochiuimaria@gmail.com or +254 710 904 327. All refund requests must include your booking reference number and the date of service.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Refund;
