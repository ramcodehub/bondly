"use client";

import ChatAssistant from "@/components/chat-assistant";

export default function TestChatPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8">Chat Assistant Test</h1>
      <p className="mb-8">Click the chat button in the bottom right corner to open the chat assistant.</p>
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to use the Chat Assistant</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Click the chat icon in the bottom right corner to open the assistant</li>
          <li>Type your message in the text area at the bottom</li>
          <li>Press Enter or click the send button to send your message</li>
          <li>The assistant will respond automatically</li>
          <li>You can minimize or close the chat window using the buttons in the header</li>
        </ul>
      </div>
      <ChatAssistant />
    </div>
  );
}