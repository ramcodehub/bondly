"use client";

import { Users, TrendingUp, Shield } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Customer-Centric Approach",
      description: "Built with the customer at the center of everything we do, ensuring seamless relationship management."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Data-Driven Insights",
      description: "Powerful analytics and reporting tools to help you make informed business decisions."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption to keep your data safe and compliant."
    }
  ];

  return (
    <section className="py-20 bg-muted/50" id="about">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">About Our CRM Solution</h2>
              <p className="text-muted-foreground mt-4">
                We've been helping businesses build stronger customer relationships for over a decade. 
                Our CRM platform is designed to be intuitive, powerful, and scalable for businesses of all sizes.
              </p>
            </div>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
              <div className="text-center p-8">
                <h3 className="text-2xl font-bold mb-4">Why Choose Our CRM?</h3>
                <p className="text-muted-foreground">
                  Experience the difference with our all-in-one solution that grows with your business.
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary/10 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}