
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const blogPosts = [
    {
      id: 1,
      title: "The Science Behind AI Massage Therapy",
      excerpt: "Discover how artificial intelligence is revolutionizing massage therapy and delivering personalized wellness experiences.",
      content: "Full article content here...",
      author: "Doris Tochiu Imaria",
      date: "2025-01-15",
      readTime: "5 min read",
      category: "Wellness",
      tags: ["AI", "Technology", "Massage"],
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "5 Benefits of Regular Massage Therapy",
      excerpt: "Learn about the proven health benefits of incorporating regular massage therapy into your wellness routine.",
      content: "Full article content here...",
      author: "Doris Tochiu Imaria",
      date: "2025-01-10",
      readTime: "7 min read",
      category: "Health",
      tags: ["Health", "Benefits", "Wellness"],
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Stress Management in Urban Living",
      excerpt: "Effective strategies for managing stress in Nairobi's fast-paced urban environment.",
      content: "Full article content here...",
      author: "Doris Tochiu Imaria",
      date: "2025-01-05",
      readTime: "6 min read",
      category: "Self-Care",
      tags: ["Stress", "Urban", "Wellness"],
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=400&fit=crop"
    },
    {
      id: 4,
      title: "The Evolution of Massage Chairs",
      excerpt: "From manual recliners to advanced AI systems - how massage chair technology has evolved over the decades.",
      content: "Full article content here...",
      author: "Doris Tochiu Imaria",
      date: "2024-12-30",
      readTime: "8 min read",
      category: "Technology",
      tags: ["Technology", "History", "Innovation"],
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=400&fit=crop"
    }
  ];
  
  const categories = ["All", "Wellness", "Health", "Self-Care", "Technology"];

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gold mb-6">Wellness Blog</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore articles, tips, and insights about massage therapy, wellness, and self-care 
            authored by our team of wellness experts.
          </p>
          <div className="w-24 h-1 bg-coral mx-auto mt-8"></div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`${
                  selectedCategory === category 
                    ? "bg-coral text-black hover:bg-coral/90" 
                    : "border-gold text-gold hover:bg-gold hover:text-black"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="bg-gray-800 border-gold/20 overflow-hidden hover:border-coral/50 transition-all duration-300 group">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                  />
                </div>
                <CardHeader>
                  <Badge className="bg-coral hover:bg-coral/90 text-black mb-2 w-fit">{post.category}</Badge>
                  <CardTitle className="text-gold text-xl group-hover:text-coral transition-colors duration-300">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-400 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 line-clamp-3 mb-4">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-coral" />
                      <span className="text-sm text-gray-400">{post.author}</span>
                    </div>
                    <Button variant="ghost" className="text-coral hover:text-coral hover:bg-gray-700 p-0 h-8">
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">No articles found in this category.</p>
              <Button 
                variant="outline"
                className="mt-4 border-coral text-coral hover:bg-coral hover:text-black"
                onClick={() => setSelectedCategory("All")}
              >
                View All Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gold mb-6">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our newsletter for the latest wellness tips, exclusive offers, and new blog posts.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Coming soon!
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coral to-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Ready to Experience Wellness?</h2>
          <p className="text-xl text-black/80 mb-8">
            Reading about wellness is great, but experiencing it is even better. Book your 
            AI massage session today at Priella.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg">
              Book Your Session
            </Button>
            <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg">
              Browse Our Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
