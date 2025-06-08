
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Users, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroImages = [
    "/lovable-uploads/bdb2ee71-df47-4127-b3de-857f36c27e42.png",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      quote: "The automated massage chairs at PriElla are incredible! I feel completely relaxed and rejuvenated after every session.",
      rating: 5
    },
    {
      name: "Michael Chen",
      quote: "Premium experience at an affordable price. The technology is amazing and the location is perfect.",
      rating: 5
    },
    {
      name: "Grace Wanjiku",
      quote: "I visit PriElla weekly now. It's become my go-to place for stress relief and self-care.",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section with Image Slider */}
      <section className="relative h-screen overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center max-w-4xl mx-auto px-4">
            <img 
              src="/lovable-uploads/e5598de2-23f3-4b89-8d22-bc28b1986003.png" 
              alt="PriElla Logo" 
              className="h-32 w-32 mx-auto mb-8 animate-fade-in"
            />
            <h1 className="text-5xl md:text-7xl font-bold text-gold mb-6 animate-fade-in">
              PRIELLA
            </h1>
            <p className="text-2xl md:text-3xl text-coral font-light mb-8 animate-fade-in">
              Relax. Recharge. Revive.
            </p>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto animate-fade-in">
              Experience the future of wellness with our automated massage chairs. 
              Premium relaxation in the heart of Nairobi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/book">
                <Button size="lg" className="bg-coral hover:bg-coral/90 text-black font-semibold px-8 py-4 text-lg">
                  Book Your Session
                </Button>
              </Link>
              <Link to="/gift-voucher">
                <Button size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black px-8 py-4 text-lg">
                  Gift a Voucher
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-coral" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gold mb-4">Our Services</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose from our range of automated massage sessions designed for your perfect relaxation experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { duration: "15 Minutes", price: "Ksh 500", description: "Quick stress relief" },
              { duration: "30 Minutes", price: "Ksh 1,000", description: "Deep relaxation" },
              { duration: "45 Minutes", price: "Ksh 1,500", description: "Complete wellness" }
            ].map((service, index) => (
              <Card key={index} className="bg-gray-800 border-gold/20 hover:border-coral/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-coral mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gold mb-2">{service.duration}</h3>
                  <p className="text-3xl font-bold text-coral mb-4">{service.price}</p>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  <Link to="/book">
                    <Button className="bg-coral hover:bg-coral/90 text-black w-full">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gold mb-4">Why Choose PriElla?</h2>
            <p className="text-xl text-gray-300">Experience the benefits of automated wellness technology</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Sparkles, title: "Automated Technology", description: "Advanced massage programs" },
              { icon: Users, title: "Expert Care", description: "Professional wellness guidance" },
              { icon: Clock, title: "Flexible Sessions", description: "15, 30, or 45-minute options" },
              { icon: Star, title: "Premium Experience", description: "Luxury in the heart of Nairobi" }
            ].map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-coral to-gold p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-gold mb-2">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-300">Real experiences from our valued customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800 border-gold/20">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-coral fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                  <p className="text-gold font-semibold">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/testimonials">
              <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
                View All Testimonials
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coral to-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Ready to Experience Premium Wellness?</h2>
          <p className="text-xl text-black/80 mb-8">
            Book your session today and discover the future of relaxation at PriElla Massage Therapy Centre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg">
                Book Your Session
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
