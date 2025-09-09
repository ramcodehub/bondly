"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, CheckCircle, Globe } from "lucide-react";

export default function StatsCounter() {
  const [counters, setCounters] = useState([
    { id: 1, icon: <Users className="h-8 w-8" />, label: "Active Users", end: 10000, current: 0 },
    { id: 2, icon: <TrendingUp className="h-8 w-8" />, label: "Business Growth", end: 250, current: 0, suffix: "%" },
    { id: 3, icon: <CheckCircle className="h-8 w-8" />, label: "Tasks Completed", end: 50000, current: 0 },
    { id: 4, icon: <Globe className="h-8 w-8" />, label: "Global Clients", end: 75, current: 0, suffix: "+" }
  ]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("stats-counter");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCounters(prev => 
        prev.map(counter => {
          if (counter.current < counter.end) {
            const increment = Math.ceil(counter.end / 100);
            return {
              ...counter,
              current: Math.min(counter.current + increment, counter.end)
            };
          }
          return counter;
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section id="stats-counter" className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {counters.map((counter) => (
            <div 
              key={counter.id} 
              className="text-center p-6 bg-background/50 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:shadow-lg"
            >
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full text-primary mb-4">
                {counter.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {counter.current.toLocaleString()}{counter.suffix || ""}
              </div>
              <div className="text-muted-foreground">{counter.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}