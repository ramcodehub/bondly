"use client"

import React, { useEffect, useState } from 'react';

export default function TestSidebarPage() {
  const [authStatus, setAuthStatus] = useState<string>('Checking...');
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [envStatus, setEnvStatus] = useState<string>('Checking...');
  const [cookiesStatus, setCookiesStatus] = useState<string>('Checking...');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/test-sidebar');
        const data = await response.json();
        
        if (data.success) {
          setAuthStatus('Authenticated');
          setUserId(data.userId);
        } else {
          setAuthStatus('Not Authenticated');
          setError(data.message);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        setAuthStatus('Error');
        setError(errorMessage);
        console.error("Error:", err);
      }
    };

    const checkEnv = async () => {
      try {
        const response = await fetch('/api/test-env');
        const data = await response.json();
        
        if (data.success) {
          setEnvStatus('Environment variables loaded');
        } else {
          setEnvStatus('Environment check failed');
        }
      } catch (err) {
        setEnvStatus('Environment check error');
      }
    };

    const checkCookies = async () => {
      try {
        const response = await fetch('/api/test-cookies');
        const data = await response.json();
        
        if (data.success) {
          setCookiesStatus(`Found ${data.allCookies.length} cookies`);
        } else {
          setCookiesStatus('Cookie check failed');
        }
      } catch (err) {
        setCookiesStatus('Cookie check error');
      }
    };

    checkAuth();
    checkEnv();
    checkCookies();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sidebar Visibility Test</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Environment Status</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Status:</span> {envStatus}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Cookie Status</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Status:</span> {cookiesStatus}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Status:</span> {authStatus}</p>
          {userId && <p><span className="font-medium">User ID:</span> {userId}</p>}
          {error && <p className="text-red-500"><span className="font-medium">Error:</span> {error}</p>}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>If you can see the sidebar on the left, the visibility fix is working</li>
          <li>If the authentication status shows "Authenticated", the API routes should work</li>
          <li>If you see any errors, they need to be addressed</li>
          <li>Check the browser console for detailed logs</li>
        </ul>
      </div>
    </div>
  );
}