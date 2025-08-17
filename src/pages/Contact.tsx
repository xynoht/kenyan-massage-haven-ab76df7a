import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          status: 'new'
        });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({ name: "", phone: "", message: "" });

    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Message Failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetDirections = () => {
    window.open("https://maps.app.goo.gl/PYZWMfidQ88mUpnP9", '_blank');
  };

  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get in touch with us for bookings, inquiries, or just to say hello. We're here to help you on your wellness journey.
          </p>
          <div className="w-24 h-1 bg-coral mx-auto mt-8"></div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-gold mb-8">Get In Touch</h2>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-coral mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Our Location</h3>
                      <p className="text-gray-300">
                        The Hub Mall Karen<br />
                        Upper Ground Floor<br />
                        Behind Nairobi Sports House<br />
                        Next to Jump<br />
                        Nairobi, Kenya
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-coral mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
                      <a 
                        href="tel:+254710904327" 
                        className="text-gray-300 hover:text-coral transition-colors"
                      >
                        +254 710 904 327
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-coral mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                      <a 
                        href="mailto:tochiuimaria@gmail.com" 
                        className="text-gray-300 hover:text-coral transition-colors"
                      >
                        tochiuimaria@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-coral mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Operating Hours</h3>
                      <div className="text-gray-300">
                        <p>Every day: 10:00 AM - 7:30 PM</p>
                        <p className="text-sm text-coral">(Including holidays)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-4">Follow Us</h3>
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="https://www.instagram.com/priellatherapy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-coral hover:text-gold transition-colors px-3 py-2 border border-coral/30 rounded-lg hover:border-gold/50"
                    >
                      Instagram
                    </a>
                    <a 
                      href="https://www.facebook.com/profile.php?id=61576776757354" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-coral hover:text-gold transition-colors px-3 py-2 border border-coral/30 rounded-lg hover:border-gold/50"
                    >
                      Facebook
                    </a>
                    <a 
                      href="https://www.tiktok.com/@priella_therapy?_t=ZM-8wv8xuDH1ra&_r=1" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-coral hover:text-gold transition-colors px-3 py-2 border border-coral/30 rounded-lg hover:border-gold/50"
                    >
                      TikTok
                    </a>
                    <a 
                      href="https://wa.me/254710904327" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-coral hover:text-gold transition-colors px-3 py-2 border border-coral/30 rounded-lg hover:border-gold/50"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

            {/* Contact Form */}
            <div>
              <Card className="bg-gray-800 border-gold/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-gold">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-white">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="+254 7XX XXX XXX"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-white">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="How can we help you?"
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-coral hover:bg-coral/90 text-black font-semibold"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gold mb-4">Find Us</h2>
            <p className="text-xl text-gray-300">Located in the heart of Karen, Nairobi</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Navigation className="h-16 w-16 text-coral mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gold mb-4">The Hub Mall Karen</h3>
            <p className="text-gray-300 mb-6">
              We're conveniently located on the upper ground floor of The Hub Mall Karen, 
              behind Nairobi Sports House and next to Jump. Easy access with ample parking available.
            </p>
            <Button onClick={handleGetDirections} className="bg-coral hover:bg-coral/90 text-black">
              Get Directions
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coral to-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Ready to Visit Us?</h2>
          <p className="text-xl text-black/80 mb-8">
            Experience the future of wellness at Priella Massage Therapy Station. 
            Book your session today or contact us for more information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg">
                Book Your Session
              </Button>
            </Link>
            <a href="tel:+254710904327">
              <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg">
                Call Us Now
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
