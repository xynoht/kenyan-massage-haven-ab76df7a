
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    {
      url: "/lovable-uploads/0d4806ef-14ea-428a-b686-590d17c79ad6.png",
      caption: "Maria - Priella Business Owner & Wellness Expert",
      category: "Team"
    },
    {
      url: "/lovable-uploads/ee4bc4ed-3880-49d3-8f3a-fc48a1f42696.png",
      caption: "Premium AI massage chairs at The Hub Karen location",
      category: "Equipment"
    },
    {
      url: "/lovable-uploads/ffd76dca-7343-44e4-a8b4-5df6f65a7879.png",
      caption: "Modern massage therapy station with multiple chairs",
      category: "Equipment"
    },
    {
      url: "/lovable-uploads/26288e67-aa97-499d-bd69-955116d1fce8.png",
      caption: "Advanced massage chair with entertainment center",
      category: "Equipment"
    },
    {
      url: "/lovable-uploads/15d8e72d-44a0-4c2f-aa00-dcae75282002.png",
      caption: "Customers enjoying relaxing massage sessions",
      category: "Experience"
    },
    {
      url: "/lovable-uploads/a3b10646-760f-4afd-a3b1-869eea03379f.png",
      caption: "Peaceful massage therapy environment with outdoor view",
      category: "Experience"
    },
    {
      url: "/lovable-uploads/4e96d9c9-9f69-4f3e-ba64-b93f065bd437.png",
      caption: "Professional massage chair experience at Priella",
      category: "Experience"
    },
    {
      url: "/lovable-uploads/49da05ee-ce24-43e8-98c9-d27ab712f4ff.png",
      caption: "State-of-the-art massage chairs with panoramic views",
      category: "Location"
    },
    {
      url: "/lovable-uploads/aed9a61e-075b-4637-89df-74f0ab4dcceb.png",
      caption: "Premium wellness facility at The Hub Karen",
      category: "Location"
    },
    {
      url: "/lovable-uploads/2ef4020c-3bcf-41a4-b889-c791cd597281.png",
      caption: "Beautiful garden views from The Hub Karen location",
      category: "Location"
    }
  ];

  const categories = ["All", "Team", "Location", "Equipment", "Experience"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages = activeCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gold mb-6">Gallery</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Take a visual journey through our premium massage therapy station. See our state-of-the-art AI massage chairs, 
            satisfied customers enjoying their wellness sessions, and the serene environment we've created for your relaxation at The Hub Karen.
          </p>
          <div className="w-24 h-1 bg-coral mx-auto mt-8"></div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`${
                  activeCategory === category 
                    ? "bg-coral text-black hover:bg-coral/90" 
                    : "border-gold text-gold hover:bg-gold hover:text-black"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <Card 
                key={index} 
                className="bg-gray-800 border-gold/20 overflow-hidden cursor-pointer group hover:border-coral/50 transition-all duration-300"
                onClick={() => openLightbox(index)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={image.url}
                    alt={image.caption}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">{image.caption}</p>
                    <p className="text-coral text-xs">{image.category}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-coral transition-colors"
          >
            <X size={32} />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-coral transition-colors"
          >
            <ChevronLeft size={48} />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-coral transition-colors"
          >
            <ChevronRight size={48} />
          </button>

          <div className="max-w-4xl max-h-full">
            <img 
              src={filteredImages[selectedImage].url}
              alt={filteredImages[selectedImage].caption}
              className="max-w-full max-h-full object-contain"
            />
            <div className="text-center mt-4">
              <p className="text-white text-lg">{filteredImages[selectedImage].caption}</p>
              <p className="text-coral">{filteredImages[selectedImage].category}</p>
            </div>
          </div>
        </div>
      )}

      {/* Experience Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gold mb-4">The Priella Experience</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every detail has been carefully designed to create the perfect massage therapy environment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Premium AI Massage Chairs",
                description: "State-of-the-art massage chairs with advanced therapeutic programs and AI technology",
                icon: "🪑"
              },
              {
                title: "Serene Environment",
                description: "Carefully curated ambiance for maximum relaxation and peace of mind",
                icon: "🧘‍♀️"
              },
              {
                title: "Professional Setting",
                description: "Located in The Hub Karen, offering a premium business environment",
                icon: "🏢"
              },
              {
                title: "Hygienic Standards",
                description: "Rigorous cleaning protocols ensure a safe and sanitized experience",
                icon: "✨"
              },
              {
                title: "Comfort Focus",
                description: "Every aspect designed for your comfort and convenience during massage sessions",
                icon: "💆‍♀️"
              },
              {
                title: "AI Technology Integration",
                description: "Cutting-edge AI technology for personalized massage experiences tailored to your needs",
                icon: "🤖"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gold/20 text-center">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gold mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coral to-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Ready to Experience It Yourself?</h2>
          <p className="text-xl text-black/80 mb-8">
            See why our customers love the Priella massage chair experience. Book your session today and 
            discover premium wellness in the heart of Nairobi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg">
                Book Your Session
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg">
                Visit Our Location
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
