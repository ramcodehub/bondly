"use client";

import { useState } from "react";
import Navbar from "../../../components/landing/navbar";
import Footer from "../../../components/landing/footer";
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

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Have questions? We're here to help. Reach out to our team and we'll get back to you within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyType">Company or Individual</Label>
                      <Select 
                        name="companyType" 
                        value={formData.companyType} 
                        onValueChange={(value) => handleSelectChange("companyType", value)}
                      >
                        <SelectTrigger>
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
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                    
                    {submitError && (
                      <div className="text-red-600 text-center mt-4">
                        {submitError}
                      </div>
                    )}
                    
                    {submitSuccess && (
                      <div className="text-green-600 text-center mt-4">
                        {successMessage}
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <p className="text-muted-foreground mb-8">
                    Reach out to us through any of these channels and we'll get back to you within 24 hours.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                      <p className="text-muted-foreground text-sm mt-1">Mon-Fri, 9:00 AM - 6:00 PM (PST)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground">support@bondly.com</p>
                      <p className="text-muted-foreground">sales@bondly.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Office</h3>
                      <p className="text-muted-foreground">
                        123 Business Ave, Suite 100<br />
                        San Francisco, CA 94107
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Office Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Friday: 9:00 AM - 6:00 PM (PST)<br />
                    Saturday: 10:00 AM - 4:00 PM (PST)<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Find answers to common questions about Bondly.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2">How long does implementation take?</h3>
                <p className="text-muted-foreground">
                  Most businesses can get up and running within 1-2 weeks, depending on the complexity of your requirements.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2">Do you offer training?</h3>
                <p className="text-muted-foreground">
                  Yes, we provide comprehensive onboarding and training sessions to ensure your team is successful.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">
                  We offer a 14-day free trial with full access to all features. No credit card required.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2">How is support provided?</h3>
                <p className="text-muted-foreground">
                  We offer 24/7 email support and business hours phone support for all our customers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}