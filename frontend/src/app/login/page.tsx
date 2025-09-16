"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { useState as useReactState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useReactState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Successfully signed in!');
      
      // On successful login, redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Bondly</h1>
            <h2 className="mt-6 text-2xl font-bold text-foreground">Sign in to your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Or{' '}
              <button
                onClick={() => router.push('/signup')}
                className="font-medium text-primary hover:text-primary/90 focus:outline-none"
              >
                create a new account
              </button>
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Icons.x className="h-5 w-5 text-destructive" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-destructive">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <Label htmlFor="email-address" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border px-3 py-2 placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border px-3 py-2 placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-muted text-primary focus:ring-primary"
                />
                <Label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                  Remember me
                </Label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/90">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.logIn className="mr-2 h-4 w-4" />
                )}
                Sign in
              </Button>
            </div>
          </form>

          {/* Social Media Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                disabled={isLoading}
              >
                <Icons.google className="h-5 w-5 text-red-500" />
                <span className="sr-only">Sign in with Google</span>
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                disabled={isLoading}
              >
                <Icons.github className="h-5 w-5" />
                <span className="sr-only">Sign in with GitHub</span>
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                disabled={isLoading}
              >
                <Icons.linkedin className="h-5 w-5 text-blue-600" />
                <span className="sr-only">Sign in with LinkedIn</span>
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">New to Bondly?</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/signup')}
              >
                <Icons.plus className="mr-2 h-4 w-4" />
                Create an account
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}