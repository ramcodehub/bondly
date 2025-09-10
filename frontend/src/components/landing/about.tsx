"use client";

import { Users, TrendingUp, Shield } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Customer-Centric Approach",
      description: "Built with the customer at the center of everything we do, ensuring seamless relationship management."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Data-Driven Insights",
      description: "Powerful analytics and reporting tools to help you make informed business decisions."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption to keep your data safe and compliant."
    }
  ];

  return (
    <section className="py-20 bg-muted/50" id="about">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">About Our Bondly Solution</h2>
              <p className="text-muted-foreground mt-4">
                We've been helping businesses build stronger customer relationships for over a decade. 
                Our Bondly platform is designed to be intuitive, powerful, and scalable for businesses of all sizes.
              </p>
            </div>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 group hover:bg-background/50 p-4 rounded-lg transition-all duration-300 hover:shadow-md"
                >
                  <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center transform transition-transform duration-500 hover:scale-105">
              <div className="text-center p-8">
                <h3 className="text-2xl font-bold mb-4">Why Choose Our Bondly?</h3>
                <p className="text-muted-foreground">
                  Experience the difference with our all-in-one solution that grows with your business.
                </p>
              </div>
            </div>
            
            {/* Enhanced decorative elements with animations */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full animate-pulse-slow"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary/10 rounded-full animate-pulse-slow delay-1000"></div>
            
            {/* Additional floating elements */}
            <div className="absolute top-1/4 -left-6 w-8 h-8 bg-primary/20 rounded-full animate-float"></div>
            <div className="absolute bottom-1/4 -right-6 w-6 h-6 bg-secondary/20 rounded-full animate-float delay-2000"></div>
          </div>
        </div>
        
        {/* Testimonials section */}
        <div className="mt-20 bg-background rounded-xl p-8 shadow-lg border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold">What Our Customers Say</h3>
            <p className="text-muted-foreground mt-2">Trusted by businesses worldwide</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-muted/50 p-6 rounded-lg border transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">JD</div>
                <div className="ml-4">
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">CEO, TechCorp</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Bondly transformed how we manage customer relationships. Our sales team is 40% more productive!"
              </p>
              <div className="flex mt-4 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-muted/50 p-6 rounded-lg border transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">AS</div>
                <div className="ml-4">
                  <h4 className="font-semibold">Alice Smith</h4>
                  <p className="text-sm text-muted-foreground">Marketing Director, GrowthInc</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The analytics dashboard alone is worth the investment. We've increased our conversion rate by 25%."
              </p>
              <div className="flex mt-4 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-muted/50 p-6 rounded-lg border transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">RJ</div>
                <div className="ml-4">
                  <h4 className="font-semibold">Robert Johnson</h4>
                  <p className="text-sm text-muted-foreground">CTO, InnovateCo</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Implementation was seamless and the support team is exceptional. Highly recommended!"
              </p>
              <div className="flex mt-4 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}