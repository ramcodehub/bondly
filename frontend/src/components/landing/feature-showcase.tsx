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

// Define the feature type
interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

// Map icon names to actual components
const iconMap = {
  BarChart3: BarChart3,
  Users: Users,
  Zap: Zap,
  Shield: Shield,
  TrendingUp: TrendingUp,
  Clock: Clock,
  Globe: Globe,
  Smartphone: Smartphone
};

export default function FeatureShowcase() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [visibleFeatures, setVisibleFeatures] = useState<Feature[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch features from backend API
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/dashboard/features');
        const result = await response.json();
        
        if (result.success) {
          setFeatures(result?.data || []);
          setVisibleFeatures((result?.data || []).slice(0, 4));
        } else {
          throw new Error(result.message || 'Failed to fetch features');
        }
      } catch (error) {
        console.error('Error fetching features:', error);
        setError('Failed to load features. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  useEffect(() => {
    if (features.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (features.length - 3));
      setVisibleFeatures(features.slice(currentIndex, currentIndex + 4).concat(
        features.slice(0, Math.max(0, (currentIndex + 4) - features.length))
      ));
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, features]);

  if (loading) {
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
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-48 animate-pulse bg-muted" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Features for Modern Business</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to streamline operations, enhance customer relationships, and drive growth.
            </p>
          </div>
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        </div>
      </section>
    );
  }

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
          {(Array.isArray(visibleFeatures) ? visibleFeatures : []).map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || BarChart3;
            return (
              <Card 
                key={feature.id || index} 
                className="transition-all duration-500 hover:shadow-xl border-0 bg-gradient-to-br from-background to-muted/50"
              >
                <CardHeader>
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white w-fit mb-4 transition-transform duration-300 hover:scale-110`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex space-x-2">
            {(Array.isArray(features) ? features : []).map((_, index) => (
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