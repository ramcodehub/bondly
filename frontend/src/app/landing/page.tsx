"use client";

import { useState } from "react";
import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import About from "@/components/landing/about";
import StatsCounter from "@/components/landing/stats-counter";
import FeatureShowcase from "@/components/landing/feature-showcase";
import Services from "@/components/landing/services";
import Contact from "@/components/landing/contact";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main>
        <Hero />
        <StatsCounter />
        <About />
        <FeatureShowcase />
        <Services />
        <div className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of businesses that trust AMGS CRM to manage their customer relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="group relative inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="relative z-10">Get Started Today</span>
                <svg 
                  className="relative z-10 ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
              <button 
                className="px-6 py-3 border border-primary text-primary font-medium rounded-lg transition-all duration-300 hover:bg-primary/10"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Features
              </button>
            </div>
          </div>
        </div>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}