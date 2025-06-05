
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Navigation, Star } from "lucide-react";

const Branches = () => {
  const currentBranch = {
    name: "The Hub Karen",
    address: "Upper Ground Floor, The Hub Karen, Nairobi",
    phone: "+254 710 904 327",
    hours: {
      weekdays: "Monday - Friday: 9:00 AM - 6:00 PM",
      saturday: "Saturday: 10:00 AM - 5:00 PM",
      sunday: "Sunday: 12:00 PM - 4:00 PM"
    },
    features: [
      "Premium AI massage chairs",
      "Professional wellness consultation",
      "Secure parking available",
      "Air-conditioned comfort",
      "Sanitized environment",
      "Easy elevator access"
    ],
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop"
  };

  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gold mb-6">Our Locations</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our premium wellness stations across Nairobi. Currently serving Karen with plans for city-wide expansion.
          </p>
          <div className="w-24 h-1 bg-coral mx-auto mt-8"></div>
        </div>
      </section>

      {/* Current Branch */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gold mb-4">Currently Serving</h2>
            <p className="text-xl text-gray-300">Our flagship location in the heart of Karen</p>
          </div>

          <Card className="bg-gray-800 border-gold/20 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 lg:h-auto">
                <img 
                  src={currentBranch.image}
                  alt={currentBranch.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center text-white">
                    <Star className="h-5 w-5 text-coral mr-2" />
                    <span className="text-sm">Premium Location</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-3xl text-gold mb-2">{currentBranch.name}</CardTitle>
                  <div className="flex items-start text-gray-300">
                    <MapPin className="h-5 w-5 mr-2 mt-1 text-coral" />
                    <span>{currentBranch.address}</span>
                  </div>
                </CardHeader>

                <CardContent className="px-0 space-y-6">
                  <div className="flex items-center text-gray-300">
                    <Phone className="h-5 w-5 mr-3 text-coral" />
                    <span>{currentBranch.phone}</span>
                  </div>

                  <div>
                    <div className="flex items-center text-gray-300 mb-2">
                      <Clock className="h-5 w-5 mr-3 text-coral" />
                      <span className="font-semibold">Operating Hours</span>
                    </div>
                    <div className="ml-8 text-gray-300 space-y-1">
                      <p>{currentBranch.hours.weekdays}</p>
                      <p>{currentBranch.hours.saturday}</p>
                      <p>{currentBranch.hours.sunday}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gold mb-4">Branch Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {currentBranch.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-300">
                          <div className="w-2 h-2 bg-coral rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button className="bg-coral hover:bg-coral/90 text-black">
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Branch
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gold mb-4">Find Us on the Map</h2>
            <p className="text-xl text-gray-300">Easily accessible location in Karen, Nairobi</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Navigation className="h-16 w-16 text-coral mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gold mb-4">Interactive Map</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Our location at The Hub Karen is easily accessible by car or public transport. 
              Ample parking is available, and we're just a short walk from major Karen landmarks.
            </p>
            <Button className="bg-coral hover:bg-coral/90 text-black">
              Open in Google Maps
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              * Full interactive map integration coming soon
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gold mb-4">Expanding Soon</h2>
            <p className="text-xl text-gray-300">We're planning to bring Priella to more locations across Nairobi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                area: "Westlands",
                status: "Planning Phase",
                timeline: "Q2 2025",
                description: "Strategic location in Nairobi's business district"
              },
              {
                area: "Kilimani",
                status: "Site Evaluation",
                timeline: "Q3 2025",
                description: "Serving the growing residential and office community"
              },
              {
                area: "CBD",
                status: "Future Consideration",
                timeline: "TBD",
                description: "Bringing wellness to the heart of the city"
              }
            ].map((location, index) => (
              <Card key={index} className="bg-gray-800 border-gold/20 text-center">
                <CardHeader>
                  <CardTitle className="text-xl text-coral">{location.area}</CardTitle>
                  <p className="text-gold">{location.status}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{location.description}</p>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-coral font-semibold">Target Opening</p>
                    <p className="text-white">{location.timeline}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-300 mb-6">
              Want to suggest a location or stay updated on our expansion plans?
            </p>
            <Button className="bg-coral hover:bg-coral/90 text-black">
              Contact Us About New Locations
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coral to-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Visit Our Karen Location Today</h2>
          <p className="text-xl text-black/80 mb-8">
            Experience premium wellness at The Hub Karen. Book your session now and discover 
            why we're Nairobi's premier AI massage therapy destination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg">
              Book Your Visit
            </Button>
            <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg">
              Call for Directions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Branches;
