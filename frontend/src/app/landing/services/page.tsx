"use client";

import { useState } from "react";
import Navbar from "../../../components/landing/navbar";
import Footer from "../../../components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Users, 
  Target, 
  CheckSquare, 
  DollarSign, 
  BarChart3, 
  Zap,
  Shield,
  MessageCircle,
  Calendar,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ServicesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const coreFeatures = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Lead Management",
      description: "Capture, track, and nurture leads through your sales pipeline with automated workflows."
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Deal Tracking",
      description: "Monitor deals at every stage with forecasting tools and pipeline visibility."
    },
    {
      icon: <CheckSquare className="h-8 w-8" />,
      title: "Task Management",
      description: "Assign, track, and complete tasks with priority levels and deadline reminders."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Contact Management",
      description: "Store and organize all your customer information in one centralized location."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics & Reporting",
      description: "Gain insights with customizable dashboards and detailed performance reports."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Automation",
      description: "Streamline repetitive tasks with powerful automation and workflow features."
    }
  ];

  const additionalFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption and compliance certifications."
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Communication Tools",
      description: "Integrated email, chat, and calling features to streamline customer interactions."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Calendar Integration",
      description: "Sync with popular calendar apps to manage appointments and meetings."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Document Management",
      description: "Store, share, and collaborate on documents directly within the CRM."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our CRM Features</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Everything you need to manage customer relationships, streamline processes, and grow your business.
              </p>
              <Button asChild>
                <Link href="/#contact">
                  Request a Demo
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Core CRM Modules</h2>
              <p className="text-muted-foreground">
                Our comprehensive suite of tools designed to cover every aspect of customer relationship management.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {coreFeatures.map((feature, index) => (
                <Card key={index} className="transition-all hover:shadow-lg hover:border-primary/20">
                  <CardHeader>
                    <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Additional Capabilities</h2>
              <p className="text-muted-foreground">
                Powerful features that extend beyond basic CRM functionality.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-background rounded-lg border">
                  <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Seamless Integrations</h2>
              <p className="text-muted-foreground">
                Connect with the tools your team already uses to create a unified workflow.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {["Google Workspace", "Microsoft 365", "Slack", "Zoom"].map((tool, index) => (
                <div key={index} className="bg-muted p-8 rounded-xl text-center">
                  <div className="bg-background w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="font-bold">{tool.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold">{tool}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-primary-foreground/90 mb-8 text-lg">
                Join thousands of businesses that trust our CRM to manage their customer relationships.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/login">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link href="/#contact">Schedule a Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}