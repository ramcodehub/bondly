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
import { useState, useEffect } from "react";

// Define the service type
interface Service {
  icon: string;
  title: string;
  description: string;
}

// Map icon names to actual components
const iconMap = {
  Users: Users,
  Target: Target,
  CheckSquare: CheckSquare,
  DollarSign: DollarSign,
  BarChart3: BarChart3,
  Zap: Zap
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/landing/services');
        const result = await response.json();
        
        if (result.success) {
          setServices(result?.data || []);
        } else {
          throw new Error(result.message || 'Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services');
        // Set empty array if API fails
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Auto-rotate services
  useEffect(() => {
    if (!isAutoPlaying || services.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, services.length]);

  const nextService = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
  };

  const prevService = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length);
  };

  const visibleServices = services.slice(currentIndex, currentIndex + 3).concat(
    services.slice(0, Math.max(0, (currentIndex + 3) - services.length))
  );

  if (loading) {
    return (
      <section className="py-20" id="services">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <div className="h-10 bg-muted animate-pulse rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-1/3 mx-auto"></div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-48 animate-pulse bg-muted" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20" id="services">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Bondly Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage customer relationships, streamline processes, and grow your business with Bondly.
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
    <section className="py-20" id="services">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Bondly Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage customer relationships, streamline processes, and grow your business with Bondly.
          </p>
        </div>
        
        {/* Enhanced services grid with carousel for mobile */}
        <div className="hidden md:grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(Array.isArray(services) ? services : []).map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Target;
            return (
              <Card 
                key={index} 
                className="transition-all hover:shadow-lg hover:border-primary/20 transform hover:-translate-y-1 duration-300"
              >
                <CardHeader>
                  <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4 transition-colors group-hover:bg-primary/20">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Carousel for mobile view */}
        <div className="md:hidden relative">
          <div className="flex overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {(Array.isArray(services) ? services : []).map((service, index) => {
                const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Target;
                return (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <Card className="transition-all hover:shadow-lg hover:border-primary/20">
                      <CardHeader>
                        <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                          <IconComponent className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{service.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Carousel controls */}
          <div className="flex justify-center mt-6 space-x-2">
            {(Array.isArray(services) ? services : []).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-muted"
                }`}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="flex justify-between mt-4">
            <button 
              onClick={prevService}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              aria-label="Previous service"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={nextService}
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              aria-label="Next service"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">All Modules Integrated Seamlessly</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Our modules work together to provide a unified view of your customer relationships, 
            eliminating data silos and improving team collaboration.
          </p>
          
          {/* Enhanced CTA button with hover effect */}
          <div className="pt-4">
            <button 
              className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10">Explore All Features</span>
              <svg 
                className="relative z-10 ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}