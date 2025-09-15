"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

export default function Footer() {
  const navigation = {
    product: [
      { name: "Features", href: "/crm#services" },
      { name: "Bondly", href: "/crm" },
      { name: "Pricing", href: "#" },
      { name: "Demo", href: "#" },
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "Guides", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Support", href: "#" },
    ],
    company: [
      { name: "About", href: "/crm#about" },
      { name: "Careers", href: "#" },
      { name: "Partners", href: "#" },
      { name: "Contact", href: "/crm#contact" },
    ],
  };

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-16 md:px-6">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex flex-col space-y-4">
              <Link href="/crm" className="flex items-center space-x-2 group">
                <span className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-secondary/80 transition-all duration-300">
                  Bondly
                </span>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                Transform your customer relationships with our powerful, intuitive Bondly platform designed for modern businesses.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
                <Button variant="outline" size="icon" className="transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button variant="outline" size="icon" className="transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
                <Button variant="outline" size="icon" className="transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-3">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Bondly. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-foreground text-sm relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              Privacy Policy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground text-sm relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              Terms of Service
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground text-sm relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}