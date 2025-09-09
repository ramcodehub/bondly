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

export default function SignupPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useReactState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const fullName = `${firstName} ${lastName}`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      
      toast.success('Account created! Please check your email for confirmation.');
      
      // Redirect to login page after successful signup
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Create a new account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <button
                onClick={() => router.push('/login')}
                className="font-medium text-primary hover:text-primary/90 focus:outline-none"
              >
                sign in to your existing account
              </button>
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Icons.x className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </Label>
                <Input
                  id="first-name"
                  name="firstName"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </Label>
                <Input
                  id="last-name"
                  name="lastName"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.plus className="mr-2 h-4 w-4" />
                )}
                Sign up
              </Button>
            </div>
          </form>

          {/* Social Media Signup Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                disabled={isLoading}
              >
                <Icons.google className="h-5 w-5 text-red-500" />
                <span className="sr-only">Sign up with Google</span>
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                disabled={isLoading}
              >
                <Icons.github className="h-5 w-5" />
                <span className="sr-only">Sign up with GitHub</span>
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                disabled={isLoading}
              >
                <Icons.linkedin className="h-5 w-5 text-blue-600" />
                <span className="sr-only">Sign up with LinkedIn</span>
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-2 text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/login')}
              >
                <Icons.logIn className="mr-2 h-4 w-4" />
                Sign in to your account
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}