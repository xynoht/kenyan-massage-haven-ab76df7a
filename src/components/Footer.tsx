
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

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
                alt="PriElla Massage Therapy Centre" 
                className="h-10 w-10"
              />
              <span className="text-gold text-xl font-bold">PRIELLA</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Premium automated massage therapy centre in Nairobi. Experience luxury wellness with cutting-edge automated massage chair technology.
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
              <li><Link to="/book-massage" className="text-gray-300 hover:text-coral transition-colors">Book Massage</Link></li>
              <li><Link to="/gift-voucher" className="text-gray-300 hover:text-coral transition-colors">Gift Voucher</Link></li>
              <li><Link to="/branches" className="text-gray-300 hover:text-coral transition-colors">Locations</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-coral transition-colors">About Us</Link></li>
              <li><Link to="/testimonials" className="text-gray-300 hover:text-coral transition-colors">Testimonials</Link></li>
            </ul>
          </div>

          {/* Social Media & Legal */}
          <div>
            <h3 className="text-gold font-semibold mb-4">Connect With Us</h3>
            <div className="space-y-4 mb-6">
              <a 
                href="https://www.instagram.com/priellatherapy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-300 hover:text-coral transition-colors"
              >
                <Instagram className="h-5 w-5 mr-2" />
                <span>Instagram</span>
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61576776757354" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-300 hover:text-coral transition-colors"
              >
                <Facebook className="h-5 w-5 mr-2" />
                <span>Facebook</span>
              </a>
              <a 
                href="https://www.tiktok.com/@priella_therapy?_t=ZM-8wv8xuDH1ra&_r=1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-300 hover:text-coral transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span>TikTok</span>
              </a>
              <a 
                href="https://wa.me/254710904327" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-300 hover:text-coral transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
            <div className="space-y-1">
              <Link to="/terms" className="block text-sm text-gray-400 hover:text-coral transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="block text-sm text-gray-400 hover:text-coral transition-colors">Privacy Policy</Link>
              <Link to="/refund" className="block text-sm text-gray-400 hover:text-coral transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 PriElla Massage Therapy Centre. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
