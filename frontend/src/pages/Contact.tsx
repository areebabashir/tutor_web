import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Loader2, Sparkles, MessageSquare, Globe, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { contactAPI } from "@/lib/api";
import { useErrorHandler } from '@/hooks/useErrorHandler';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleError } = useErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const contactData = {
        fullName: formData.name,
        emailAddress: formData.email,
        subject: formData.subject,
        message: formData.message
      };

      await contactAPI.submitContact(contactData);

      toast.success("Message Sent Successfully! Thank you for contacting us. We'll get back to you within 24 hours.");
      
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      handleError(error, {
        title: 'Failed to Send Message',
        description: 'Unable to send your message. Please try again later or contact us directly.',
        duration: 8000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      contact: "bizlishofficial@gmail.com",
      link: "mailto:bizlishofficial@gmail.com",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Available for inquiries",
      contact: "+92 318 5078571",
      link: "tel:+923185078571",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      icon: Globe,
      title: "Follow Us",
      description: "Stay connected on Instagram",
      contact: "@bizlishofficial",
      link: "https://www.instagram.com/bizlishofficial?igsh=dnhlbm9oemhhM213&utm_source=qr",
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-50 to-pink-100"
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Contact Us - Get Help with Your English Learning | Bizlish"
        description="Get in touch with our expert team for course inquiries, support, and guidance. Contact us at +92 318 5078571 or bizlishofficial@gmail.com. Follow us on Instagram @bizlishofficial for updates."
        keywords="contact bizlish, English learning support, course inquiries, IELTS help, spoken English support, competitive exam guidance, customer service, +92 318 5078571, bizlishofficial@gmail.com"
        ogTitle="Contact Bizlish - Your English Learning Support Team"
        ogDescription="Need help with your English learning journey? Contact us at +92 318 5078571 or bizlishofficial@gmail.com for personalized guidance and support."
        canonical="https://bizlish.com/contact"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-accent py-20 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4 mr-2" />
            We're Here to Help
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Get in Touch
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Have questions about our courses or need help getting started? We're here to help you on your learning journey.
          </p>
        </div>
      </section>


      {/* Contact Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="animate-fade-in-up">
              <Card className="card-modern shadow-lg">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                      <Send className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Send us a Message</CardTitle>
                      <p className="text-muted-foreground">
                        Fill out the form below and we'll get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your full name"
                          className="input-modern"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@example.com"
                          className="input-modern"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="What's this about?"
                        className="input-modern"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        className="input-modern resize-none"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full btn-modern bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Start Learning?
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We're here to help you every step of the way. Choose the best way to reach us and we'll respond as quickly as possible.
                </p>
              </div>

              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="card-modern hover-lift group">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <method.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
                          <p className="text-muted-foreground mb-2">{method.description}</p>
                          <a 
                            href={method.link} 
                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                            target={method.link.includes('instagram.com') ? '_blank' : undefined}
                            rel={method.link.includes('instagram.com') ? 'noopener noreferrer' : undefined}
                          >
                            {method.contact}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-secondary/50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose BIZLISH Support?
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Our dedicated support team is committed to providing you with the best learning experience possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center stagger-item animate-fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Support</h3>
              <p className="text-muted-foreground">
                Available 24/7 to support students from around the world with multilingual assistance.
              </p>
            </div>
            
            <div className="text-center stagger-item animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
              <p className="text-muted-foreground">
                Get personalized advice from certified business English professionals and career experts.
              </p>
            </div>
            
            <div className="text-center stagger-item animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Response</h3>
              <p className="text-muted-foreground">
                Receive responses within 24 hours, with urgent matters addressed even faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Check out our FAQ section or contact us directly.
          </p>
          <Button size="lg" className="btn-modern bg-gradient-to-r from-primary to-accent text-white">
            View FAQ
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;