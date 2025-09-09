"use client";

import { useState, useEffect } from "react";
import ChatAssistant from "@/components/chat-assistant";

export default function DebugChatPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const openChat = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openChatAssistant'));
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8">Chat Assistant Debug Page</h1>
      
      <div className="mb-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Debug Controls</h2>
        <button 
          onClick={openChat}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Open Chat Assistant via Event
        </button>
        <p className="mt-4 text-sm text-muted-foreground">
          If the chat assistant doesn't appear, click the button above to trigger it via custom event.
        </p>
      </div>

      <div className="mb-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Expected Behavior</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You should see a chat icon in the bottom-right corner of the screen</li>
          <li>Clicking the icon should open the chat assistant</li>
          <li>Using the button above should also open the chat assistant</li>
          <li>The chat should have a welcome message from the assistant</li>
          <li>You should be able to type messages and receive responses</li>
        </ul>
      </div>

      {isClient && <ChatAssistant />}
    </div>
  );
}