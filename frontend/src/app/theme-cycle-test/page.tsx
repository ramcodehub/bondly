"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ThemeCycleTestPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Theme Cycle Test</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Theme: <span className="font-mono bg-muted px-2 py-1 rounded">{theme}</span></CardTitle>
            <CardDescription>Test the theme cycling functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button onClick={() => setTheme("light")}>Set Light Theme</Button>
              <Button onClick={() => setTheme("dark")}>Set Dark Theme</Button>
              <Button onClick={() => setTheme("system")}>Set System Theme</Button>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-medium mb-4">Theme Toggle (Click to Cycle):</h3>
              <ThemeToggle />
              <p className="mt-2 text-sm text-muted-foreground">
                Click the button above to cycle through Light → Dark → System → Light
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card 1</CardTitle>
              <CardDescription>This card should adapt to the current theme</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Background and text colors should change with the theme.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Card 2</CardTitle>
              <CardDescription>Another themed card</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Borders should also adapt to maintain proper contrast.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Card 3</CardTitle>
              <CardDescription>Third themed card</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">All elements should adapt to the selected theme.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}