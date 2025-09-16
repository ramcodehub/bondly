"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ThemeTestPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Theme Test Page</h1>
        
        <div className="mb-8 p-6 rounded-lg border bg-card text-card-foreground">
          <h2 className="text-2xl font-semibold mb-4">Current Theme: {theme}</h2>
          <p className="mb-4">This page demonstrates the theme system functionality.</p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Button onClick={() => setTheme("light")}>Set Light Theme</Button>
            <Button onClick={() => setTheme("dark")}>Set Dark Theme</Button>
            <Button onClick={() => setTheme("system")}>Set System Theme</Button>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-medium mb-4">Theme Toggle Component:</h3>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <h3 className="text-xl font-medium mb-2">Card 1</h3>
            <p>This is a sample card to test theme colors.</p>
          </div>
          
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <h3 className="text-xl font-medium mb-2">Card 2</h3>
            <p>This is another sample card to test theme colors.</p>
          </div>
        </div>
      </div>
    </div>
  );
}