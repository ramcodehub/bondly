"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Users, 
  Zap, 
  Shield,
  TrendingUp,
  Clock,
  Globe,
  Smartphone
} from "lucide-react";

export default function FeatureShowcase() {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Real-time dashboards with customizable reports and predictive analytics.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description: "Seamless communication tools and shared workspaces for your entire team.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Optimized performance with sub-second response times for all operations.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with industry security standards.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Growth Tracking",
      description: "Monitor KPIs and track business growth with automated insights.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support with dedicated account managers.",
      color: "from-rose-500 to-red-500"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Access",
      description: "Access your data from anywhere with our cloud-based infrastructure.",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Ready",
      description: "Full functionality on all devices with our responsive mobile app.",
      color: "from-violet-500 to-purple-500"
    }
  ];

  const [visibleFeatures, setVisibleFeatures] = useState(features.slice(0, 4));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (features.length - 3));
      setVisibleFeatures(features.slice(currentIndex, currentIndex + 4).concat(
        features.slice(0, Math.max(0, (currentIndex + 4) - features.length))
      ));
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, features]);

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Powerful Features for Modern Business</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to streamline operations, enhance customer relationships, and drive growth.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {visibleFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="transition-all duration-500 hover:shadow-xl border-0 bg-gradient-to-br from-background to-muted/50"
            >
              <CardHeader>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white w-fit mb-4 transition-transform duration-300 hover:scale-110`}>
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

        <div className="mt-12 text-center">
          <div className="inline-flex space-x-2">
            {features.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  Math.abs(index - currentIndex) <= 1 ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}