
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      quote: "The AI massage chairs at Priella are incredible! I feel completely relaxed and rejuvenated after every session. The personalized experience is truly something special, and the environment is so peaceful.",
      rating: 5,
      date: "January 10, 2025",
      source: "Google Reviews"
    },
    {
      name: "Michael Chen",
      quote: "Premium experience at an affordable price. The technology is amazing and the location is perfect. I've been to many massage places in Nairobi, and Priella stands out for its innovation and quality.",
      rating: 5,
      date: "January 8, 2025",
      source: "Direct Feedback"
    },
    {
      name: "Grace Wanjiku",
      quote: "I visit Priella weekly now. It's become my go-to place for stress relief and self-care. The staff is friendly, the chairs are amazing, and I always leave feeling like a new person!",
      rating: 5,
      date: "January 5, 2025",
      source: "Instagram"
    },
    {
      name: "David Ochieng",
      quote: "As someone who suffers from chronic back pain, finding Priella has been a blessing. The AI massage chairs target my problem areas perfectly, and I've noticed significant improvement after just a few sessions.",
      rating: 5,
      date: "January 3, 2025",
      source: "Google Reviews"
    },
    {
      name: "Priya Shah",
      quote: "The convenience of booking online and the premium location at The Hub make Priella perfect for fitting self-care into my busy schedule. Highly recommended for professionals who need quick stress relief!",
      rating: 5,
      date: "January 1, 2025",
      source: "WhatsApp"
    },
    {
      name: "James Mwangi",
      quote: "I was skeptical about AI massage chairs, but Priella completely changed my mind. The experience is just as good as a manual massage, and the consistency is even better. Now I'm hooked!",
      rating: 4,
      date: "December 28, 2024",
      source: "Facebook"
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gold mb-6">Client Testimonials</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. See what our clients have to say about their 
            Priella AI massage therapy experience.
          </p>
          <div className="w-24 h-1 bg-coral mx-auto mt-8"></div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800 border-gold/20 hover:border-coral/50 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-coral fill-current" />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gray-600" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gold font-semibold">{testimonial.name}</p>
                    <div className="flex justify-between items-center text-sm text-gray-400 mt-1">
                      <span>{testimonial.date}</span>
                      <span>via {testimonial.source}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Highlighted Testimonial */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gold mb-4">The Priella Experience</h2>
            <p className="text-xl text-gray-300">What makes our clients come back time after time</p>
          </div>
          
          <div className="bg-gradient-to-br from-coral to-gold p-1 rounded-lg">
            <div className="bg-gray-800 rounded-lg p-8 md:p-12">
              <div className="flex justify-center mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-8 w-8 text-coral fill-current" />
                ))}
              </div>
              
              <p className="text-white text-xl md:text-2xl italic text-center mb-8">
                "Priella's AI massage therapy has transformed my wellness routine. As someone who works
                long hours at a desk, the targeted back and neck programs have been a lifesaver. The fact that
                I can book a quick 30-minute session during lunch and return to work feeling rejuvenated is incredible.
                The Hub Karen location is convenient, clean, and professional."
              </p>
              
              <div className="text-center">
                <p className="text-gold text-lg font-semibold">Jennifer Kimani</p>
                <p className="text-gray-300">Corporate Executive & Regular Client</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gold mb-4">Client Satisfaction</h2>
            <p className="text-xl text-gray-300">The numbers speak for themselves</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "98%", label: "Client Satisfaction Rate" },
              { value: "87%", label: "Return Within 30 Days" },
              { value: "4.9/5", label: "Average Rating" },
              { value: "100+", label: "Happy Clients" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-coral mb-2">{stat.value}</p>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Review */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gold mb-6">Share Your Experience</h2>
          <p className="text-xl text-gray-300 mb-8">
            Had a great experience at Priella? We'd love to hear about it!
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://www.google.com/search?q=priella+massage+therapy+station" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-coral hover:text-gold transition-colors"
            >
              Google Review
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61576776757354" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-coral hover:text-gold transition-colors"
            >
              Facebook Review
            </a>
            <a 
              href="https://www.instagram.com/priellatherapy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-coral hover:text-gold transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coral to-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Experience It For Yourself</h2>
          <p className="text-xl text-black/80 mb-8">
            Join our satisfied clients and discover the Priella difference today.
            Book your first session and start your wellness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/book">
              <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-md">
                Book Your Session
              </button>
            </a>
            <a href="/contact">
              <button className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg font-semibold rounded-md transition-colors">
                Contact Us
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
