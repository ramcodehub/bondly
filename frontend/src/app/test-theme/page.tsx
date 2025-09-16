"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function TestThemePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Theme Test</h1>
        
        <div className="mb-8 p-6 rounded-lg border bg-card text-card-foreground">
          <h2 className="text-2xl font-semibold mb-4">Current Theme: <span className="font-mono bg-muted px-2 py-1 rounded">{theme}</span></h2>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <Button onClick={() => setTheme("light")}>Set Light Theme</Button>
            <Button onClick={() => setTheme("dark")}>Set Dark Theme</Button>
            <Button onClick={() => setTheme("system")}>Set System Theme</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <h3 className="text-xl font-medium mb-2">Card 1</h3>
            <p className="text-muted-foreground">This card should adapt to the current theme.</p>
          </div>
          
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <h3 className="text-xl font-medium mb-2">Card 2</h3>
            <p className="text-muted-foreground">Background and text colors should change with the theme.</p>
          </div>
          
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <h3 className="text-xl font-medium mb-2">Card 3</h3>
            <p className="text-muted-foreground">Borders should also adapt to maintain proper contrast.</p>
          </div>
        </div>
        
        <div className="mt-8 p-6 rounded-lg border bg-muted">
          <h3 className="text-xl font-medium mb-4">Muted Background Test</h3>
          <p className="text-muted-foreground">This section uses a muted background that should adapt to the theme.</p>
        </div>
      </div>
    </div>
  );
}