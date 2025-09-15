"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight animate-fade-in">
              Transform Your Business with <span className="text-primary">Bondly</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-delay">
              Streamline your customer relationships, manage leads, track deals, and boost productivity with Bondly, the all-in-one Bondly platform designed for modern businesses.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
            <Button size="lg" asChild className="group hover:scale-105 transition-transform duration-300">
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="hover:scale-105 transition-transform duration-300">
              <Link href="/crm#about">Learn More</Link>
            </Button>
          </div>
          
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fade-in-delay-3">
            <div className="transform hover:-translate-y-2 transition-transform duration-300">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="transform hover:-translate-y-2 transition-transform duration-300">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="transform hover:-translate-y-2 transition-transform duration-300">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
            <div className="transform hover:-translate-y-2 transition-transform duration-300">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-muted-foreground">Secure</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced background decoration with gradients and animations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full filter blur-3xl animate-float delay-2000"></div>
      </div>
      
      {/* Subtle particle effect */}
      <div className="absolute inset-0 -z-20">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-primary/5"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              animation: `pulse ${Math.random() * 4 + 2}s infinite alternate`
            }}
          />
        ))}
      </div>
    </section>
  );
}