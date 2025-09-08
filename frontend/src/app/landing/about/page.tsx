"use client";

import { useState } from "react";
import Navbar from "../../../components/landing/navbar";
import Footer from "../../../components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About AMGS CRM</h1>
              <p className="text-xl text-muted-foreground mb-8">
                We're on a mission to transform how businesses manage customer relationships through innovative technology with AMGS CRM.
              </p>
              <Button asChild>
                <Link href="/#contact">
                  Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 2015, AMGS CRM began with a simple idea: customer relationship management should be intuitive, 
                  powerful, and accessible to businesses of all sizes.
                </p>
                <p className="text-muted-foreground mb-4">
                  What started as a small team of passionate developers has grown into a company serving thousands of 
                  businesses worldwide. Our platform has evolved to meet the changing needs of modern businesses while 
                  maintaining our core commitment to simplicity and effectiveness.
                </p>
                <p className="text-muted-foreground">
                  Today, we continue to innovate and push boundaries, ensuring our customers have the tools they need 
                  to build lasting customer relationships and drive growth.
                </p>
              </div>
              <div className="bg-muted rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center p-8">
                  <h3 className="text-2xl font-bold mb-4">10+ Years of Excellence</h3>
                  <p className="text-muted-foreground">
                    Helping businesses transform their customer relationships
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Mission & Vision</h2>
              <p className="text-muted-foreground">
                We believe in the power of technology to transform business relationships.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-background p-8 rounded-xl border">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground mb-4">
                  To empower businesses of all sizes with intuitive, powerful CRM tools that help them build stronger, 
                  more profitable customer relationships.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Simplify customer relationship management</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Drive business growth through insights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Enable data-driven decision making</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-background p-8 rounded-xl border">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground mb-4">
                  To be the leading CRM platform that businesses trust to manage their most valuable asset - customer relationships.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Innovate continuously to stay ahead</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Provide exceptional customer experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Build a community of successful businesses</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Preview */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Meet Our Leadership</h2>
              <p className="text-muted-foreground">
                The passionate team driving our vision forward
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="text-center">
                  <div className="mx-auto bg-muted rounded-full w-24 h-24 mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold">T{item}</span>
                  </div>
                  <h3 className="text-xl font-semibold">Team Member {item}</h3>
                  <p className="text-muted-foreground">Leadership Role</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}