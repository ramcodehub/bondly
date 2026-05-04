"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

// Define the stat type
interface Stat {
  title: string;
  value: string;
  description: string;
}

interface Particle {
  top: string;
  left: string;
  width: string;
  height: string;
  animationDelay: string;
  pulseDuration: string;
}

export default function Hero() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const fetchHeroStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/landing/hero-stats');
        const result = await response.json();

        if (result.success) {
          setStats(result?.data || []);
        } else {
          throw new Error(result.message || 'Failed to fetch hero stats');
        }
      } catch (error) {
        console.error('Error fetching hero stats:', error);
        setError('Failed to load hero stats');
        // Set empty array if API fails
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroStats();

    // Generate random particles only on the client to avoid hydration mismatch
    const newParticles = [...Array(20)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 10 + 2}px`,
      height: `${Math.random() * 10 + 2}px`,
      animationDelay: `${Math.random() * 5}s`,
      pulseDuration: `${Math.random() * 4 + 2}s`
    }));
    setParticles(newParticles);
  }, []);

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
            {loading ? (
              // Loading skeleton
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="h-8 bg-muted animate-pulse rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2 mx-auto"></div>
                </div>
              ))
            ) : error ? (
              // Error message
              <div className="col-span-4 text-red-500 py-4">
                {error}
              </div>
            ) : (
              // Actual stats
              (Array.isArray(stats) ? stats : []).map((stat, index) => (
                <div key={index} className="transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.description}</div>
                </div>
              ))
            )}
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
        {(Array.isArray(particles) ? particles : []).map((particle, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/5"
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.width,
              height: particle.height,
              animation: `pulse ${particle.pulseDuration} infinite alternate`,
              animationDelay: particle.animationDelay
            }}
          />
        ))}
      </div>
    </section>
  );
}