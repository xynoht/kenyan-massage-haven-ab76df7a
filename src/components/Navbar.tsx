
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Branches", href: "/branches" },
    { name: "Gallery", href: "/gallery" },
    { name: "Management", href: "/management" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/e5598de2-23f3-4b89-8d22-bc28b1986003.png" 
              alt="Priella Massage Therapy Station" 
              className="h-12 w-12"
            />
            <span className="text-gold text-xl font-bold">PRIELLA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-coral ${
                  isActive(item.href) ? "text-coral" : "text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex space-x-2">
              <Link to="/book">
                <Button className="bg-coral hover:bg-coral/90 text-black font-semibold text-sm px-4 py-2">
                  Book Now
                </Button>
              </Link>
              <Link to="/gift-voucher">
                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black text-sm px-4 py-2">
                  Gift Voucher
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-coral"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black/98 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 text-base font-medium transition-colors hover:text-coral ${
                  isActive(item.href) ? "text-coral" : "text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="space-y-2 px-3 pt-2">
              <Link to="/book" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-coral hover:bg-coral/90 text-black font-semibold">
                  Book Now
                </Button>
              </Link>
              <Link to="/gift-voucher" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-black">
                  Gift Voucher
                </Button>
              </Link>
              <Link to="/terms" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full text-white hover:text-coral">
                  Terms & Conditions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
