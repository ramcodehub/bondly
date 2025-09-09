"use client";

import ChatAssistant from "@/components/chat-assistant";

export default function VerifyChatPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8">Chat Assistant Verification</h1>
      
      <div className="mb-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Verification Steps</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Look for the chat icon in the bottom-right corner of the screen</li>
          <li>Click the icon to open the chat assistant</li>
          <li>Verify that the chat window opens and shows the welcome message</li>
          <li>Try typing a message and sending it</li>
          <li>Verify that you receive a response from the assistant</li>
          <li>Try minimizing and closing the chat window</li>
        </ol>
      </div>

      <div className="mb-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>If you don't see the chat icon, check the browser console for errors</li>
          <li>Make sure all dependencies are installed correctly</li>
          <li>Verify that the component is properly imported and mounted</li>
          <li>Check that there are no CSS conflicts</li>
        </ul>
      </div>

      {/* The chat assistant should appear in the bottom-right corner */}
      <ChatAssistant />
    </div>
  );
}