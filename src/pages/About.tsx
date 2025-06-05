
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Star, Target } from "lucide-react";

const About = () => {
  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gold mb-6">About Priella</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Pioneering the future of wellness in Nairobi with AI-powered massage therapy technology.
            </p>
            <div className="w-24 h-1 bg-coral mx-auto mt-8"></div>
          </div>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gold mb-6">Our Story</h2>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Priella Massage Therapy Station was born from a vision to make premium wellness accessible 
                to everyone in Nairobi. Founded by wellness enthusiast Doris Tochiu Imaria, we recognized 
                the growing need for stress relief and self-care in our fast-paced urban environment.
              </p>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                By combining cutting-edge AI technology with the therapeutic benefits of massage therapy, 
                we've created a unique wellness experience that delivers professional-quality massages 
                in a convenient, accessible format.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Located in the heart of Karen at The Hub, we're bringing the future of wellness to Nairobi, 
                one relaxing session at a time.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop"
                alt="Relaxing spa environment"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gold mb-4">Our Values</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The principles that guide our mission to bring premium wellness to everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Wellness First",
                description: "Your health and relaxation are our top priorities in everything we do."
              },
              {
                icon: Users,
                title: "Accessibility",
                description: "Making premium wellness experiences accessible to all members of our community."
              },
              {
                icon: Star,
                title: "Excellence",
                description: "Delivering the highest quality service and technology for your comfort."
              },
              {
                icon: Target,
                title: "Innovation",
                description: "Continuously evolving with the latest wellness technology and practices."
              }
            ].map((value, index) => (
              <Card key={index} className="bg-gray-800 border-gold/20 text-center">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-coral to-gold p-4 rounded-full w-16 h-16 mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-gold mb-4">{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location Highlight */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop"
                alt="The Hub Karen location"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-gold mb-6">Premium Location</h2>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Situated in The Hub Karen, one of Nairobi's most prestigious business centers, 
                Priella offers a serene escape from the bustling city life. Our location provides 
                easy access, ample parking, and a professional environment perfect for your wellness journey.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-coral rounded-full mr-4 mt-2"></div>
                  <div>
                    <h3 className="text-gold font-semibold">Convenient Access</h3>
                    <p className="text-gray-300">Located on the upper ground floor with elevator access</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-coral rounded-full mr-4 mt-2"></div>
                  <div>
                    <h3 className="text-gold font-semibold">Secure Environment</h3>
                    <p className="text-gray-300">Professional building with 24/7 security</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-coral rounded-full mr-4 mt-2"></div>
                  <div>
                    <h3 className="text-gold font-semibold">Modern Facilities</h3>
                    <p className="text-gray-300">Clean, air-conditioned space with premium amenities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Experience */}
      <section className="py-20 bg-gradient-to-r from-coral to-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">The Priella Experience</h2>
          <p className="text-xl text-black/80 mb-8 leading-relaxed">
            From the moment you step into our wellness station, you'll experience a journey of relaxation 
            and rejuvenation designed to refresh your mind, body, and spirit. Our AI-powered massage chairs 
            provide a personalized experience that adapts to your unique needs, ensuring every session is 
            perfectly tailored for maximum benefit.
          </p>
          <div className="bg-black/20 rounded-lg p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-black mb-4">Our Promise to You</h3>
            <p className="text-lg text-black/90">
              "To provide you with a premium wellness experience that leaves you feeling refreshed, 
              rejuvenated, and ready to take on the world."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
