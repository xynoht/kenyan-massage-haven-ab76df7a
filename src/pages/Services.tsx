
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Sparkles, Heart, Zap } from "lucide-react";

const Services = () => {
  const services = [
    {
      duration: "15 Minutes",
      price: "Ksh 500",
      description: "Perfect for a quick stress relief break during your busy day. Targeted massage to release tension and refresh your mind.",
      features: ["Quick stress relief", "Neck & shoulder focus", "Energy boost", "Mental clarity"],
      icon: Zap,
      popular: false
    },
    {
      duration: "30 Minutes",
      price: "Ksh 1,000",
      description: "Our most popular session. Deep relaxation with comprehensive massage programs targeting all major muscle groups.",
      features: ["Full body massage", "Deep muscle relief", "Stress reduction", "Improved circulation"],
      icon: Heart,
      popular: true
    },
    {
      duration: "45 Minutes",
      price: "Ksh 1,500",
      description: "The ultimate wellness experience. Complete relaxation journey with advanced AI programs for maximum therapeutic benefits.",
      features: ["Complete wellness", "Advanced AI programs", "Maximum relaxation", "Therapeutic benefits"],
      icon: Sparkles,
      popular: false
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gold mb-6">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Experience the future of wellness with our AI-powered massage chairs. 
            Choose the perfect session duration for your relaxation needs.
          </p>
          <div className="w-24 h-1 bg-coral mx-auto"></div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className={`bg-gray-800 border-gold/20 hover:border-coral/50 transition-all duration-300 hover:scale-105 relative ${
                  service.popular ? 'border-coral ring-2 ring-coral/20' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-coral text-black px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="bg-gradient-to-br from-coral to-gold p-4 rounded-full w-16 h-16 mx-auto mb-4">
                    <service.icon className="h-8 w-8 text-black" />
                  </div>
                  <CardTitle className="text-2xl text-gold">{service.duration}</CardTitle>
                  <div className="text-4xl font-bold text-coral">{service.price}</div>
                </CardHeader>
                
                <CardContent className="text-center">
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-coral rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Link to="/book">
                    <Button className="bg-coral hover:bg-coral/90 text-black w-full font-semibold">
                      Book This Session
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Benefits */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gold mb-4">Why Choose Our AI Massage Chairs?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience cutting-edge technology combined with therapeutic expertise for unparalleled relaxation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Advanced AI Technology",
                description: "Intelligent massage programs that adapt to your body's needs",
                icon: "🤖"
              },
              {
                title: "Therapeutic Benefits",
                description: "Proven health benefits including stress reduction and improved circulation",
                icon: "💆‍♀️"
              },
              {
                title: "Customizable Experience",
                description: "Adjustable intensity and focus areas for personalized comfort",
                icon: "⚙️"
              },
              {
                title: "Premium Comfort",
                description: "Luxury seating with ergonomic design for maximum relaxation",
                icon: "🛋️"
              },
              {
                title: "Hygienic & Safe",
                description: "Sanitized between sessions with contactless operation",
                icon: "🧼"
              },
              {
                title: "Professional Setting",
                description: "Located in The Hub Karen, a premium business environment",
                icon: "🏢"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-gray-800 rounded-lg border border-gold/20">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gold mb-3">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coral to-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Ready to Experience Premium Wellness?</h2>
          <p className="text-xl text-black/80 mb-8">
            Book your preferred session duration and step into a world of relaxation and rejuvenation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg">
                Book Your Session
              </Button>
            </Link>
            <Link to="/gift-voucher">
              <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg">
                Gift a Voucher
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
