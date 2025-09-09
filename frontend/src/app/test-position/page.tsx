"use client";

export default function TestPositionPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8">Position Test</h1>
      <p className="mb-8">Check the bottom-right corner for a red box.</p>
      
      {/* Test element to verify positioning */}
      <div className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-red-500 shadow-lg z-50">
        <div className="flex items-center justify-center h-full text-white font-bold">
          TEST
        </div>
      </div>
      
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">What you should see</h2>
        <p className="mb-4">
          There should be a red box with "TEST" text in the bottom-right corner of the screen.
          If you can see it, then positioning is working correctly.
        </p>
        
        <h2 className="text-xl font-semibold mb-4">Troubleshooting steps</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Check if the red test box appears in the bottom-right corner</li>
          <li>If it doesn't appear, there might be CSS issues with positioning</li>
          <li>If it does appear, the issue might be with the chat assistant component itself</li>
          <li>Check browser console for any JavaScript errors</li>
          <li>Verify that all dependencies are properly installed</li>
        </ol>
      </div>
    </div>
  );
}