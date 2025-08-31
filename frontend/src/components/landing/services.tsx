"use client";

import { 
  Users, 
  Target, 
  CheckSquare, 
  DollarSign, 
  BarChart3, 
  Zap 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Services() {
  const services = [
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

  return (
    <section className="py-20" id="services">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Bondly Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage customer relationships, streamline processes, and grow your business with Bondly.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card key={index} className="transition-all hover:shadow-lg hover:border-primary/20">
              <CardHeader>
                <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">All Modules Integrated Seamlessly</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Our modules work together to provide a unified view of your customer relationships, 
            eliminating data silos and improving team collaboration.
          </p>
        </div>
      </div>
    </section>
  );
}