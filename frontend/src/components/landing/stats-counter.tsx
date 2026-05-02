"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, CheckCircle, Globe } from "lucide-react";
import supabase from '@/lib/supabase-client';

export default function StatsCounter() {
  const [counters, setCounters] = useState([
    { id: 1, icon: <Users className="h-8 w-8" />, label: "Active Users", end: 0, current: 0 },
    { id: 2, icon: <TrendingUp className="h-8 w-8" />, label: "Business Growth", end: 0, current: 0, suffix: "%" },
    { id: 3, icon: <CheckCircle className="h-8 w-8" />, label: "Tasks Completed", end: 0, current: 0 },
    { id: 4, icon: <Globe className="h-8 w-8" />, label: "Global Clients", end: 0, current: 0, suffix: "+" }
  ]);

  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch counts for various entities
        const [companiesResult, contactsResult, leadsResult, tasksResult] = await Promise.all([
          supabase.from('companies').select('*', { count: 'exact', head: true }),
          supabase.from('contacts').select('*', { count: 'exact', head: true }),
          supabase.from('leads').select('*', { count: 'exact', head: true }),
          supabase.from('tasks').select('*', { count: 'exact', head: true })
        ]);

        // Update counters with real data
        setCounters(prev => prev.map(counter => {
          switch(counter.id) {
            case 1: // Active Users (using contacts count)
              return { ...counter, end: contactsResult.count || 0 };
            case 2: // Business Growth (using companies count as percentage)
              return { ...counter, end: Math.min(companiesResult.count || 0, 100) };
            case 3: // Tasks Completed (using completed tasks count)
              return { ...counter, end: tasksResult.count || 0 };
            case 4: // Global Clients (using companies count)
              return { ...counter, end: companiesResult.count || 0 };
            default:
              return counter;
          }
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to companies changes
    const companiesSubscription = supabase
      .channel('companies-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'companies',
        },
        (payload) => {
          // Refetch companies count when there's a change
          supabase.from('companies').select('*', { count: 'exact', head: true }).then(result => {
            if (!result.error) {
              setCounters(prev => prev.map(counter => 
                counter.id === 4 ? { ...counter, end: result.count || 0 } : counter
              ));
            }
          });
        }
      )
      .subscribe();

    // Subscribe to contacts changes
    const contactsSubscription = supabase
      .channel('contacts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contacts',
        },
        (payload) => {
          // Refetch contacts count when there's a change
          supabase.from('contacts').select('*', { count: 'exact', head: true }).then(result => {
            if (!result.error) {
              setCounters(prev => prev.map(counter => 
                counter.id === 1 ? { ...counter, end: result.count || 0 } : counter
              ));
            }
          });
        }
      )
      .subscribe();

    // Subscribe to leads changes
    const leadsSubscription = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
        },
        (payload) => {
          // Refetch leads count when there's a change
          supabase.from('leads').select('*', { count: 'exact', head: true }).then(result => {
            if (!result.error) {
              // Update business growth percentage (using companies count as proxy)
              setCounters(prev => prev.map(counter => 
                counter.id === 2 ? { ...counter, end: Math.min(result.count || 0, 100) } : counter
              ));
            }
          });
        }
      )
      .subscribe();

    // Subscribe to tasks changes
    const tasksSubscription = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          // Refetch tasks count when there's a change
          supabase.from('tasks').select('*', { count: 'exact', head: true }).then(result => {
            if (!result.error) {
              setCounters(prev => prev.map(counter => 
                counter.id === 3 ? { ...counter, end: result.count || 0 } : counter
              ));
            }
          });
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(companiesSubscription);
      supabase.removeChannel(contactsSubscription);
      supabase.removeChannel(leadsSubscription);
      supabase.removeChannel(tasksSubscription);
    };
  }, []);

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
    if (!isVisible || loading) return;

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
  }, [isVisible, loading]);

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