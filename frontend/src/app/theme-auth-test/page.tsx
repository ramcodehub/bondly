"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ThemeAuthTestPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Theme Authentication Test</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Theme: <span className="font-mono bg-muted px-2 py-1 rounded">{theme}</span></CardTitle>
            <CardDescription>Test the theme functionality on auth pages</CardDescription>
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
              <CardTitle>Login Page</CardTitle>
              <CardDescription>Test login page theme adaptation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">The login page should now properly adapt to dark mode.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Signup Page</CardTitle>
              <CardDescription>Test signup page theme adaptation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">The signup page should now properly adapt to dark mode.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}