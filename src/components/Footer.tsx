
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/e5598de2-23f3-4b89-8d22-bc28b1986003.png" 
                alt="Priella Massage Therapy Station" 
                className="h-10 w-10"
              />
              <span className="text-gold text-xl font-bold">PRIELLA</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Premium AI-powered massage therapy station in Nairobi. Experience luxury wellness with cutting-edge technology.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2 text-gold" />
                <span>The Hub Karen, Upper Ground Floor, Nairobi</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2 text-gold" />
                <span>+254 710 904 327</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2 text-gold" />
                <span>tochiuimaria@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-gray-300 hover:text-coral transition-colors">Services</Link></li>
              <li><Link to="/book" className="text-gray-300 hover:text-coral transition-colors">Book Massage</Link></li>
              <li><Link to="/gift-voucher" className="text-gray-300 hover:text-coral transition-colors">Gift Voucher</Link></li>
              <li><Link to="/branches" className="text-gray-300 hover:text-coral transition-colors">Locations</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-coral transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-gold font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 mb-6">
              <li><a href="https://www.instagram.com/priellatherapy" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-coral transition-colors">Instagram</a></li>
              <li><a href="https://www.facebook.com/profile.php?id=61576776757354" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-coral transition-colors">Facebook</a></li>
              <li><a href="https://www.tiktok.com/@priella_therapy?_t=ZM-8wv8xuDH1ra&_r=1" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-coral transition-colors">TikTok</a></li>
              <li><a href="https://wa.me/254710904327" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-coral transition-colors">WhatsApp</a></li>
            </ul>
            <div className="space-y-1">
              <Link to="/terms" className="block text-sm text-gray-400 hover:text-coral transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="block text-sm text-gray-400 hover:text-coral transition-colors">Privacy Policy</Link>
              <Link to="/refund" className="block text-sm text-gray-400 hover:text-coral transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Priella Massage Therapy Station. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
