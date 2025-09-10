"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    companyType: "individual",
    company: "",
    location: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");
    
    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          companyType: formData.companyType,
          company: formData.company,
          location: formData.location,
          message: formData.message
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setSuccessMessage(result.message || `Thank you, ${formData.name}, your message has been received! Our team will contact you very soon.`);
        setFormData({ 
          name: "", 
          email: "", 
          subject: "",
          companyType: "individual",
          company: "",
          location: "",
          message: "" 
        });
      } else {
        setSubmitError(result.error || "Failed to submit form. Please try again.");
      }
    } catch (error) {
      setSubmitError("Network error. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
      
      // Reset success message after 5 seconds
      if (submitSuccess) {
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }
    }
  };
  
  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone",
      value: "+1 (555) 123-4567"
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      value: "support@Bondly.com"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Office",
      value: "123 Business Ave, Suite 100, San Francisco, CA 94107"
    }
  ];

  return (
    <section className="py-20 bg-muted/50" id="contact">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Get In Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about Bondly? Our team is here to help you succeed.
          </p>
        </div>
        
        <div className="grid gap-12 lg:grid-cols-2">
          <Card className="transition-all duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Your name" 
                    required 
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="your.email@example.com" 
                    required 
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    placeholder="What is this regarding?" 
                    required 
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyType">Company or Individual</Label>
                  <Select 
                    name="companyType" 
                    value={formData.companyType} 
                    onValueChange={(value) => handleSelectChange("companyType", value)}
                  >
                    <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/50">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.companyType === "company" && (
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company" 
                      name="company" 
                      value={formData.company} 
                      onChange={handleChange} 
                      placeholder="Your company name" 
                      required 
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="Your location (city, state)" 
                    required 
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="How can we help you?" 
                    rows={5} 
                    required 
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full group transition-all duration-300 hover:scale-105"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg 
                        className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </Button>
                
                {submitError && (
                  <div className="text-red-600 text-center mt-4 animate-fade-in">
                    {submitError}
                  </div>
                )}
                
                {submitSuccess && (
                  <div className="text-green-600 text-center mt-4 animate-fade-in">
                    {successMessage}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-muted-foreground mb-8">
                Reach out to us through any of these channels and we'll get back to you within 24 hours.
              </p>
            </div>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 group hover:bg-background/50 p-4 rounded-lg transition-all duration-300 hover:shadow-md"
                >
                  <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{info.title}</h4>
                    <p className="text-muted-foreground">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-background p-6 rounded-lg border transition-all duration-300 hover:shadow-md">
              <h4 className="font-semibold mb-2">Office Hours</h4>
              <p className="text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM (PST)<br />
                Saturday: 10:00 AM - 4:00 PM (PST)<br />
                Sunday: Closed
              </p>
            </div>
            
            {/* Enhanced CTA section */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-primary-foreground">
              <h4 className="font-semibold text-lg mb-2">Need immediate assistance?</h4>
              <p className="mb-4 opacity-90">
                Chat with our support team right now for instant help.
              </p>
              <Button 
                variant="secondary" 
                className="group"
                onClick={() => {
                  // Dispatch custom event to open chat assistant
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('openChatAssistant'));
                  }
                }}
              >
                Start Live Chat
                <svg 
                  className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}