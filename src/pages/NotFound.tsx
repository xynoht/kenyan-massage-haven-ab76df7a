
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-coral mb-6">404</h1>
        <p className="text-2xl text-gold mb-8">Page Not Found</p>
        <p className="text-gray-300 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track to relaxation and wellness.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-coral hover:bg-coral/90 text-black w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Return to Homepage
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
