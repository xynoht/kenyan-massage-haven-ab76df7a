import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, ArrowLeft, ArrowRight } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  const blogPosts = [
    {
      id: 1,
      title: "The Science Behind AI Massage Therapy",
      excerpt: "Discover how artificial intelligence is revolutionizing massage therapy and delivering personalized wellness experiences.",
      content: `
        <h2>Introduction</h2>
        <p>Artificial Intelligence (AI) has transformed many industries, and massage therapy is no exception. At Priella, we're at the forefront of this revolution, combining cutting-edge AI technology with traditional wellness practices to deliver unparalleled massage experiences.</p>
        
        <h2>How AI Enhances Massage Therapy</h2>
        <p>Our AI-powered massage chairs use sophisticated algorithms to analyze your body's unique needs and adjust accordingly. Here's how it works:</p>
        
        <h3>1. Body Scanning Technology</h3>
        <p>Advanced sensors scan your body to identify key pressure points, muscle tension areas, and optimal massage zones. This ensures each session is tailored specifically to your physique.</p>
        
        <h3>2. Pressure Adaptation</h3>
        <p>The AI continuously monitors your body's response and adjusts pressure levels in real-time, ensuring maximum therapeutic benefit without discomfort.</p>
        
        <h3>3. Pattern Recognition</h3>
        <p>Our systems learn from thousands of massage sessions to identify the most effective techniques for stress relief, muscle recovery, and overall wellness.</p>
        
        <h2>Benefits of AI Massage Therapy</h2>
        <ul>
          <li><strong>Consistency:</strong> Every session delivers the same high-quality experience</li>
          <li><strong>Personalization:</strong> Treatments adapted to your specific needs</li>
          <li><strong>Precision:</strong> Exact pressure and technique application</li>
          <li><strong>Evolution:</strong> Continuous improvement through machine learning</li>
        </ul>
        
        <h2>The Future of Wellness</h2>
        <p>AI massage therapy represents the future of wellness technology. By combining the therapeutic benefits of traditional massage with the precision and consistency of artificial intelligence, we're creating a new standard in relaxation and recovery.</p>
        
        <h2>Experience AI Massage at Priella</h2>
        <p>Ready to experience the future of massage therapy? Visit us at The Hub Karen and discover how AI technology can transform your wellness routine. Book your session today and feel the difference that intelligent massage technology can make.</p>
      `,
      author: "Dr. Maria Tochiu",
      date: "2025-01-15",
      readTime: "8 min read",
      category: "Technology",
      tags: ["AI", "Technology", "Massage", "Innovation"],
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "5 Benefits of Regular Massage Therapy",
      excerpt: "Learn about the proven health benefits of incorporating regular massage therapy into your wellness routine.",
      content: `
        <h2>The Power of Regular Massage</h2>
        <p>Regular massage therapy isn't just a luxury—it's an investment in your health and well-being. Scientific research has consistently shown that regular massage sessions can provide numerous physical and mental health benefits.</p>
        
        <h2>1. Stress Reduction and Mental Health</h2>
        <p>One of the most immediate benefits of massage therapy is stress reduction. Massage triggers the release of endorphins, your body's natural "feel-good" chemicals, while simultaneously reducing cortisol levels—the hormone associated with stress.</p>
        
        <h3>Mental Health Benefits:</h3>
        <ul>
          <li>Reduced anxiety and depression symptoms</li>
          <li>Improved mood and emotional well-being</li>
          <li>Better sleep quality</li>
          <li>Enhanced mental clarity and focus</li>
        </ul>
        
        <h2>2. Improved Circulation and Heart Health</h2>
        <p>Massage therapy enhances blood circulation throughout your body, delivering more oxygen and nutrients to your muscles and organs. This improved circulation supports cardiovascular health and can help regulate blood pressure.</p>
        
        <h2>3. Pain Relief and Muscle Recovery</h2>
        <p>Regular massage therapy is highly effective for managing chronic pain conditions and accelerating muscle recovery after exercise or injury.</p>
        
        <h3>Pain Management Benefits:</h3>
        <ul>
          <li>Reduced muscle tension and knots</li>
          <li>Alleviation of chronic back and neck pain</li>
          <li>Faster recovery from sports injuries</li>
          <li>Improved flexibility and range of motion</li>
        </ul>
        
        <h2>4. Enhanced Immune Function</h2>
        <p>Studies have shown that regular massage can boost your immune system by increasing the activity of white blood cells, which help your body fight off illness and infection.</p>
        
        <h2>5. Better Posture and Alignment</h2>
        <p>Many of us spend hours hunched over computers or devices, leading to poor posture and related pain. Regular massage helps realign your body and address muscular imbalances caused by poor posture.</p>
        
        <h2>How Often Should You Get Massages?</h2>
        <p>For optimal benefits, we recommend:</p>
        <ul>
          <li><strong>Weekly sessions:</strong> For high stress levels or chronic pain</li>
          <li><strong>Bi-weekly sessions:</strong> For general wellness and stress management</li>
          <li><strong>Monthly sessions:</strong> For maintenance and prevention</li>
        </ul>
        
        <h2>Start Your Wellness Journey at Priella</h2>
        <p>Experience these incredible benefits for yourself at Priella Massage Therapy Centre. Our state-of-the-art AI massage chairs provide consistent, professional-quality treatment that fits into your busy schedule.</p>
      `,
      author: "Dr. Maria Tochiu",
      date: "2025-01-10",
      readTime: "7 min read",
      category: "Health",
      tags: ["Health", "Benefits", "Wellness", "Lifestyle"],
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Stress Management in Urban Living",
      excerpt: "Effective strategies for managing stress in Nairobi's fast-paced urban environment.",
      content: `
        <h2>The Urban Stress Challenge</h2>
        <p>Living in Nairobi, like many modern cities, comes with unique stressors. Traffic jams, work pressure, pollution, and the constant pace of urban life can take a significant toll on our physical and mental well-being. Understanding how to manage this stress is crucial for maintaining a healthy, balanced lifestyle.</p>
        
        <h2>Common Urban Stressors in Nairobi</h2>
        <h3>1. Traffic and Commuting</h3>
        <p>Nairobi's notorious traffic can add hours to your daily commute, creating frustration and eating into personal time. This daily stress can accumulate over time, affecting your overall well-being.</p>
        
        <h3>2. Work-Life Balance</h3>
        <p>The competitive business environment often demands long hours, making it challenging to find time for relaxation and self-care.</p>
        
        <h3>3. Air Quality and Noise</h3>
        <p>Urban pollution and constant noise can cause physical stress on your body, contributing to fatigue and health issues.</p>
        
        <h2>Effective Stress Management Strategies</h2>
        
        <h3>1. Regular Massage Therapy</h3>
        <p>One of the most effective ways to combat urban stress is through regular massage therapy. At Priella, our AI massage chairs provide convenient, consistent stress relief that fits into your busy schedule.</p>
        
        <h3>2. Mindful Commuting</h3>
        <p>Transform your commute into a stress-relief opportunity:</p>
        <ul>
          <li>Listen to calming music or podcasts</li>
          <li>Practice deep breathing exercises</li>
          <li>Use public transport to read or meditate</li>
          <li>Consider carpooling to reduce driving stress</li>
        </ul>
        
        <h3>3. Create Urban Oases</h3>
        <p>Find green spaces and quiet areas in the city where you can recharge:</p>
        <ul>
          <li>Visit Uhuru Park or Central Park for quick nature breaks</li>
          <li>Create a peaceful corner in your home</li>
          <li>Use rooftop gardens or balconies for fresh air</li>
        </ul>
        
        <h3>4. Technology Boundaries</h3>
        <p>Set limits on technology use to reduce mental overload:</p>
        <ul>
          <li>Designate phone-free times</li>
          <li>Limit news consumption</li>
          <li>Use apps mindfully</li>
        </ul>
        
        <h2>The Role of Professional Stress Relief</h2>
        <p>While self-care strategies are important, professional stress relief services play a crucial role in urban wellness. Regular massage therapy provides:</p>
        
        <ul>
          <li>Deep muscle relaxation that's hard to achieve on your own</li>
          <li>Consistent, professional-quality stress relief</li>
          <li>A dedicated time and space for relaxation</li>
          <li>Physical and mental reset from urban pressures</li>
        </ul>
        
        <h2>Building Resilience</h2>
        <p>Stress management isn't about eliminating all stress—it's about building resilience to handle urban challenges effectively. Regular self-care practices, including massage therapy, help you develop this resilience.</p>
        
        <h2>Your Urban Wellness Partner</h2>
        <p>At Priella, we understand the unique stresses of urban living in Nairobi. Located conveniently at The Hub Karen, we provide accessible, high-quality stress relief services designed for busy urban professionals. Take a break from the city's demands and invest in your well-being.</p>
      `,
      author: "Dr. Maria Tochiu",
      date: "2025-01-05",
      readTime: "6 min read",
      category: "Wellness",
      tags: ["Stress", "Urban", "Wellness", "Lifestyle"],
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=400&fit=crop"
    },
    {
      id: 4,
      title: "The Evolution of Massage Chairs",
      excerpt: "From manual recliners to advanced AI systems - how massage chair technology has evolved over the decades.",
      content: `
        <h2>A Journey Through Time</h2>
        <p>The massage chair industry has undergone a remarkable transformation over the past several decades. What began as simple vibrating recliners has evolved into sophisticated wellness systems that rival professional massage therapy. Let's explore this fascinating evolution and see how we arrived at today's advanced AI-powered massage chairs.</p>
        
        <h2>The Early Days: Simple Vibration (1950s-1970s)</h2>
        <p>The first massage chairs were basic recliners with simple vibrating motors. These early models provided minimal therapeutic benefit but introduced the concept of automated relaxation furniture to the market.</p>
        
        <h3>Key Features:</h3>
        <ul>
          <li>Basic vibration patterns</li>
          <li>Limited adjustment options</li>
          <li>Simple timer controls</li>
          <li>Minimal ergonomic design</li>
        </ul>
        
        <h2>The Mechanical Revolution (1980s-1990s)</h2>
        <p>Japanese manufacturers began incorporating mechanical rollers and more sophisticated movement patterns. This era saw the introduction of chairs that could mimic basic massage techniques.</p>
        
        <h3>Innovations:</h3>
        <ul>
          <li>Mechanical roller systems</li>
          <li>Multiple massage programs</li>
          <li>Better body scanning</li>
          <li>Improved ergonomics</li>
        </ul>
        
        <h2>The Digital Age (2000s-2010s)</h2>
        <p>The integration of computer technology transformed massage chairs into sophisticated wellness devices. Digital controls, preset programs, and improved body scanning became standard features.</p>
        
        <h3>Major Advances:</h3>
        <ul>
          <li>Computer-controlled movements</li>
          <li>3D massage technology</li>
          <li>Zero gravity positioning</li>
          <li>Heat therapy integration</li>
          <li>Air compression systems</li>
        </ul>
        
        <h2>The AI Revolution (2020s-Present)</h2>
        <p>Today's massage chairs represent the pinnacle of wellness technology. Artificial intelligence, advanced sensors, and machine learning have created chairs that adapt to each user's unique needs.</p>
        
        <h3>Current Technologies:</h3>
        <ul>
          <li>AI-powered body scanning</li>
          <li>Real-time pressure adjustment</li>
          <li>Personalized massage programs</li>
          <li>Biometric feedback integration</li>
          <li>App connectivity and remote control</li>
          <li>Voice command capabilities</li>
        </ul>
        
        <h2>The Science Behind Modern Massage Chairs</h2>
        <p>Today's advanced massage chairs incorporate multiple therapeutic modalities:</p>
        
        <h3>1. Shiatsu Technique</h3>
        <p>Precise pressure point stimulation based on traditional Japanese massage methods.</p>
        
        <h3>2. Swedish Massage</h3>
        <p>Long, flowing strokes that promote relaxation and circulation.</p>
        
        <h3>3. Deep Tissue Therapy</h3>
        <p>Targeted pressure for muscle knots and chronic tension areas.</p>
        
        <h3>4. Reflexology</h3>
        <p>Foot and calf massage based on pressure point therapy principles.</p>
        
        <h2>The Priella Advantage</h2>
        <p>At Priella, we've carefully selected the most advanced AI massage chairs available today. Our chairs represent the cutting edge of massage technology, incorporating decades of innovation and research.</p>
        
        <h3>What Sets Our Chairs Apart:</h3>
        <ul>
          <li>Latest AI technology for personalized experiences</li>
          <li>Professional-grade therapeutic capabilities</li>
          <li>Continuous software updates and improvements</li>
          <li>Ergonomic design for all body types</li>
          <li>Hygienic, contactless operation</li>
        </ul>
        
        <h2>Looking to the Future</h2>
        <p>The evolution of massage chair technology continues to accelerate. Future developments may include:</p>
        
        <ul>
          <li>Advanced biometric monitoring</li>
          <li>Virtual reality integration</li>
          <li>Predictive health analytics</li>
          <li>IoT connectivity for smart home integration</li>
          <li>Personalized aromatherapy systems</li>
        </ul>
        
        <h2>Experience the Evolution</h2>
        <p>The journey from simple vibrating chairs to today's AI-powered massage systems represents one of the most remarkable evolutions in wellness technology. At Priella, you can experience the very latest in this evolution, enjoying the benefits of decades of innovation in massage chair technology.</p>
        
        <p>Visit us at The Hub Karen and discover how far massage chair technology has come. Book your session today and be part of the continuing evolution of wellness technology.</p>
      `,
      author: "Dr. Maria Tochiu",
      date: "2024-12-30",
      readTime: "10 min read",
      category: "Technology",
      tags: ["Technology", "History", "Innovation", "Evolution"],
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=400&fit=crop"
    }
  ];

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.id === parseInt(id || '0'));
    if (foundPost) {
      setPost(foundPost);
      // Get related posts (same category or tag)
      const related = blogPosts
        .filter(p => p.id !== foundPost.id && 
                (p.category === foundPost.category || 
                 p.tags.some(tag => foundPost.tags.includes(tag))))
        .slice(0, 3);
      setRelatedPosts(related);
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!post) {
    return (
      <div className="pt-16 min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gold mb-4">Post Not Found</h1>
          <p className="text-gray-300 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button className="bg-coral hover:bg-coral/90 text-black">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Back to Blog */}
      <section className="py-8 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog">
            <Button variant="ghost" className="text-coral hover:text-gold hover:bg-gray-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="bg-coral hover:bg-coral/90 text-black mb-4">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gold mb-6">{post.title}</h1>
            <p className="text-xl text-gray-300 mb-8">{post.excerpt}</p>
            
            <div className="flex items-center justify-center text-sm text-gray-400 space-x-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-800 border-gold/20">
            <CardContent className="p-8 md:p-12">
              <div 
                className="prose prose-lg prose-invert max-w-none
                  prose-headings:text-gold prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                  prose-ul:text-gray-300 prose-li:mb-2
                  prose-strong:text-coral"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-gold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-coral text-coral hover:bg-coral hover:text-black">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gold mb-4">Related Articles</h2>
              <p className="text-gray-300">Continue exploring our wellness insights</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="bg-gray-800 border-gold/20 overflow-hidden hover:border-coral/50 transition-all duration-300 group">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                    />
                  </div>
                  <CardHeader>
                    <Badge className="bg-coral hover:bg-coral/90 text-black mb-2 w-fit">{relatedPost.category}</Badge>
                    <CardTitle className="text-gold text-lg group-hover:text-coral transition-colors duration-300">
                      {relatedPost.title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-400 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(relatedPost.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 line-clamp-3 mb-4">{relatedPost.excerpt}</p>
                    <Link to={`/blog/${relatedPost.id}`}>
                      <Button variant="ghost" className="text-coral hover:text-coral hover:bg-gray-700 p-0 h-8">
                        Read More <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coral to-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Ready to Experience Wellness?</h2>
          <p className="text-xl text-black/80 mb-8">
            Turn knowledge into action. Book your AI massage session today and experience the benefits firsthand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg">
                Book Your Session
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg">
                View Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;