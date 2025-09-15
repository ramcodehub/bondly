"use client";

import { useState } from "react";
import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import About from "@/components/landing/about";
import Services from "@/components/landing/services";
import Contact from "@/components/landing/contact";
import Footer from "@/components/landing/footer";

export default function CrmPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main>
        <Hero />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}