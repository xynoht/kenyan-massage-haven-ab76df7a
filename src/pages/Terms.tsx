
import { Card, CardContent } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gold mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-300">Last Updated: June 5, 2024</p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-800 border-gold/20">
            <CardContent className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl text-gold mb-4">1. Introduction</h2>
                <p className="text-gray-300">
                  Welcome to Priella Massage Therapy Station. These Terms of Service govern your use of our website, services, and mobile applications. By accessing or using our services, you agree to be bound by these Terms. If you do not agree with any part of these terms, you may not use our services.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">2. Services Description</h2>
                <p className="text-gray-300">
                  Priella Massage Therapy Station provides AI-powered massage chair services at our physical locations. Our services include massage sessions of varying durations, gift vouchers, and related wellness services.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">3. Booking and Cancellation</h2>
                <p className="text-gray-300 mb-4">
                  All bookings are subject to availability and confirmation. Users may book services through our website, phone, or in person.
                </p>
                <p className="text-gray-300 mb-4">
                  Cancellation Policy:
                </p>
                <ul className="list-disc pl-8 text-gray-300 space-y-2">
                  <li>Cancellations made more than 24 hours before the appointment: Full refund</li>
                  <li>Cancellations made within 24 hours: 50% refund</li>
                  <li>No-shows: No refund</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">4. Gift Vouchers</h2>
                <p className="text-gray-300 mb-4">
                  Gift vouchers are valid for 12 months from the date of purchase unless otherwise stated. Vouchers cannot be exchanged for cash and must be presented at the time of redemption. Lost vouchers cannot be replaced.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">5. Health and Safety</h2>
                <p className="text-gray-300 mb-4">
                  Users are required to disclose any health conditions that may affect their ability to safely use our massage services. Priella reserves the right to refuse service if we believe the service may pose a health risk to the customer.
                </p>
                <p className="text-gray-300">
                  Users must follow all safety instructions provided by staff. We cannot be held liable for injury resulting from failure to follow instructions.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">6. Use of Website and Mobile Applications</h2>
                <p className="text-gray-300">
                  You agree not to use our website or mobile applications for any unlawful purpose or in any way that could damage, disable, overburden, or impair our services.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">7. Privacy Policy</h2>
                <p className="text-gray-300">
                  Our Privacy Policy, available separately, explains how we collect, use, and protect your personal information.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-300">
                  Priella Massage Therapy Station will not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use or inability to use our services.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">9. Changes to Terms</h2>
                <p className="text-gray-300">
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after changes are posted constitutes your acceptance of the modified Terms.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">10. Contact Information</h2>
                <p className="text-gray-300">
                  If you have any questions about these Terms, please contact us at tochiuimaria@gmail.com or +254 710 904 327.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Terms;
