
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, User, MessageCircle, Lock } from "lucide-react";
import AdminLogin from "@/components/admin/AdminLogin";

const Management = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Check if admin is already logged in
    const sessionData = localStorage.getItem('adminSession');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        setAdminData(session);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('adminSession');
      }
    }
  }, []);

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handlePhoneClick = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_blank');
  };

  const handleWhatsAppClick = (phoneNumber: string) => {
    // Format phone number for WhatsApp (remove any spaces, dashes, etc.)
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  const handleLoginSuccess = (data: any) => {
    setAdminData(data);
    setIsAuthenticated(true);
  };

  // Show admin login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-coral rounded-full mb-4">
              <Lock className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-gold mb-2">Management Access</h1>
            <p className="text-gray-300">This area is restricted to authorized personnel only.</p>
          </div>
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gold mb-6">Meet Our Team</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The passionate individuals behind Priella Massage Therapy Station, dedicated to bringing you the best in wellness and relaxation.
          </p>
          <div className="w-24 h-1 bg-coral mx-auto mt-8"></div>
        </div>
      </section>

      {/* Founder Profile */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-800 border-gold/20 overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Profile Image */}
              <div className="bg-gradient-to-br from-coral to-gold p-8 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full overflow-hidden">
                  <img 
                    src="/lovable-uploads/f125c9ed-74e3-4d8d-ac19-f18b99a4bf4f.png"
                    alt="Doris Tochiu Imaria"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Profile Information */}
              <div className="p-8 lg:p-12">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-3xl text-gold mb-2">Doris Tochiu Imaria</CardTitle>
                  <p className="text-coral text-xl font-semibold">Founder & Wellness Director</p>
                </CardHeader>
                
                <CardContent className="px-0">
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                    Doris is the visionary founder of Priella Massage Therapy Station, bringing together her passion 
                    for wellness and technology to create a unique relaxation experience in Nairobi. With a deep 
                    understanding of the modern urban lifestyle's stresses, she has pioneered the integration of 
                    AI-powered massage therapy in Kenya's wellness industry.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-gray-300">
                      <Phone className="h-5 w-5 mr-3 text-coral" />
                      <span>+254 710 904 327</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Mail className="h-5 w-5 mr-3 text-coral" />
                      <span>tochiuimaria@gmail.com</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-5 w-5 mr-3 text-coral" />
                      <span>The Hub Karen, Nairobi</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={() => handleEmailClick('tochiuimaria@gmail.com')}
                      className="bg-coral hover:bg-coral/90 text-black"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button 
                      onClick={() => handlePhoneClick('+254710904327')}
                      variant="outline" 
                      className="border-gold text-gold hover:bg-gold hover:text-black"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                    <Button 
                      onClick={() => handleWhatsAppClick('+254710904327')}
                      variant="outline" 
                      className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Employee Profile */}
          <Card className="bg-gray-800 border-gold/20 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Profile Image */}
              <div className="bg-gradient-to-br from-gold to-coral p-8 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full overflow-hidden">
                  <img 
                    src="/lovable-uploads/04bb823e-8ea9-4013-add4-7630e90be3dd.png"
                    alt="Anthony Geoffrey"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Profile Information */}
              <div className="p-8 lg:p-12">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-3xl text-gold mb-2">Anthony Geoffrey</CardTitle>
                  <p className="text-coral text-xl font-semibold">Wellness Assistant</p>
                </CardHeader>
                
                <CardContent className="px-0">
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                    Anthony is our dedicated wellness assistant who ensures every client receives exceptional service and support 
                    throughout their wellness journey. With a commitment to customer satisfaction and wellness 
                    excellence, he helps maintain the high standards that Priella is known for.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-gray-300">
                      <Phone className="h-5 w-5 mr-3 text-coral" />
                      <span>+254 724 946 613</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Mail className="h-5 w-5 mr-3 text-coral" />
                      <span>anthonygeoffrey87@gmail.com</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-5 w-5 mr-3 text-coral" />
                      <span>The Hub Karen, Nairobi</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={() => handleEmailClick('anthonygeoffrey87@gmail.com')}
                      className="bg-coral hover:bg-coral/90 text-black"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button 
                      onClick={() => handlePhoneClick('+254724946613')}
                      variant="outline" 
                      className="border-gold text-gold hover:bg-gold hover:text-black"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button 
                      onClick={() => handleWhatsAppClick('+254724946613')}
                      variant="outline" 
                      className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gold mb-4">Leadership Philosophy</h2>
            <p className="text-xl text-gray-300">Building wellness communities through innovation and care</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-800 border-gold/20">
              <CardHeader>
                <CardTitle className="text-xl text-gold">Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  To make premium wellness accessible to every individual in Nairobi and beyond, 
                  creating a network of relaxation stations that serve as urban oases of tranquility.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gold/20">
              <CardHeader>
                <CardTitle className="text-xl text-gold">Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  To leverage cutting-edge technology in delivering therapeutic massage experiences 
                  that promote physical wellness, mental clarity, and emotional balance for our community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Professional Background */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gold mb-4">Professional Background</h2>
            <p className="text-xl text-gray-300">Experience and expertise in wellness innovation</p>
          </div>
          
          <div className="space-y-8">
            <Card className="bg-gray-800 border-gold/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-coral mb-4">Wellness Industry Expertise</h3>
                <p className="text-gray-300 mb-4">
                  With years of experience in the wellness and hospitality industry, Doris has developed 
                  a deep understanding of customer needs and market demands in the Nairobi wellness sector.
                </p>
                <ul className="text-gray-300 space-y-2">
                  <li>• 5+ years in wellness and customer service industry</li>
                  <li>• Pioneered AI massage therapy adoption in Kenya</li>
                  <li>• Expert in customer experience optimization</li>
                  <li>• Passionate advocate for mental health and self-care</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gold/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-coral mb-4">Innovation & Technology</h3>
                <p className="text-gray-300 mb-4">
                  Doris has been instrumental in bringing advanced massage technology to the Kenyan market, 
                  carefully selecting and implementing AI-powered systems that deliver consistent, 
                  therapeutic results.
                </p>
                <ul className="text-gray-300 space-y-2">
                  <li>• Technology integration specialist</li>
                  <li>• Quality assurance and customer safety expert</li>
                  <li>• Business development and strategic planning</li>
                  <li>• Community wellness program development</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Future Team Section */}
      <section className="py-20 bg-gradient-to-r from-coral to-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Growing Our Team</h2>
          <p className="text-xl text-black/80 mb-8">
            As Priella continues to expand, we're always looking for passionate individuals who share 
            our commitment to wellness and exceptional customer service. Join us in revolutionizing 
            the wellness industry in Nairobi.
          </p>
          <Button 
            onClick={() => handleEmailClick('tochiuimaria@gmail.com')}
            size="lg" 
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg"
          >
            <Mail className="h-5 w-5 mr-2" />
            Contact Us About Opportunities
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Management;
