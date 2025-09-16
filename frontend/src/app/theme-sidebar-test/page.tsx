"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ThemeSidebarTestPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Theme Sidebar Test</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Theme: <span className="font-mono bg-muted px-2 py-1 rounded">{theme}</span></CardTitle>
            <CardDescription>Test the theme functionality with the sidebar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setTheme("light")}>Set Light Theme</Button>
              <Button onClick={() => setTheme("dark")}>Set Dark Theme</Button>
              <Button onClick={() => setTheme("system")}>Set System Theme</Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>
    </div>
  );
}