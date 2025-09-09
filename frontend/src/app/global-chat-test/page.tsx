"use client";

export default function GlobalChatTestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8">Global Chat Assistant Test</h1>
      
      <div className="mb-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Testing Global Chat Assistant</h2>
        <p className="mb-4">
          This page is a simple test to verify that the chat assistant is available globally.
          You should see the chat icon in the bottom-right corner of the screen.
        </p>
        
        <h3 className="text-lg font-medium mb-2">What to check:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>The chat icon should appear in the bottom-right corner</li>
          <li>Clicking the icon should open the chat assistant</li>
          <li>The chat should work the same as on other pages</li>
          <li>This confirms the global implementation is working</li>
        </ul>
      </div>

      <div className="mb-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Implementation Details</h2>
        <p className="mb-4">
          The chat assistant is now implemented globally by adding it to the client layout component.
          This ensures it appears on all pages including:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Landing page</li>
          <li>Login page</li>
          <li>Signup page</li>
          <li>Dashboard pages</li>
          <li>All other application pages</li>
        </ul>
      </div>
    </div>
  );
}