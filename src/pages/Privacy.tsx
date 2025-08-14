
import { Card, CardContent } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gold mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-300">Last Updated: January 14, 2025</p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-800 border-gold/20">
            <CardContent className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl text-gold mb-4">1. Introduction</h2>
                <p className="text-gray-300">
                  At Priella Massage Therapy Station, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our services or visit our website.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">2. Information We Collect</h2>
                <p className="text-gray-300 mb-4">
                  We collect the following types of information:
                </p>
                <ul className="list-disc pl-8 text-gray-300 space-y-2">
                  <li><strong>Personal Identification Information:</strong> Name, phone number, email address, postal address</li>
                  <li><strong>Booking Information:</strong> Appointment details, service preferences, payment information</li>
                  <li><strong>Health Information:</strong> Any health conditions relevant to our services</li>
                  <li><strong>Website Usage Data:</strong> IP address, browser type, pages visited, time spent on pages</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-300 mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc pl-8 text-gray-300 space-y-2">
                  <li>To process and manage your bookings</li>
                  <li>To communicate with you about your appointments</li>
                  <li>To customize your wellness experience</li>
                  <li>To send promotional offers and newsletters (with your consent)</li>
                  <li>To improve our services and website</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">4. Data Storage and Security</h2>
                <p className="text-gray-300">
                  Your data is stored securely in our database with appropriate security measures in place to prevent unauthorized access. We use encryption for sensitive information and regularly update our security protocols.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">5. Data Sharing</h2>
                <p className="text-gray-300 mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc pl-8 text-gray-300 space-y-2">
                  <li><strong>Service Providers:</strong> Payment processors, SMS/email service providers</li>
                  <li><strong>Legal Compliance:</strong> When required by law or to protect our rights</li>
                </ul>
                <p className="text-gray-300 mt-4">
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">6. Your Rights</h2>
                <p className="text-gray-300 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-8 text-gray-300 space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your data (where applicable)</li>
                  <li>Object to processing of your data</li>
                  <li>Withdraw consent</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">7. Cookies</h2>
                <p className="text-gray-300">
                  Our website uses cookies to enhance your browsing experience. You can set your browser to refuse cookies, but some parts of our website may not function properly as a result.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">8. Changes to This Privacy Policy</h2>
                <p className="text-gray-300">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl text-gold mb-4">9. Contact Us</h2>
                <p className="text-gray-300">
                  If you have any questions about this Privacy Policy, please contact us at tochiuimaria@gmail.com or +254 710 904 327.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
