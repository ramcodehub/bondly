"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { ChatConversation } from "@/types/chat";
import chatConversations from "@/lib/data/chat-conversations.json";
import Link from "next/link";

export default function ChatReviewPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>(chatConversations);
  const [reviewStatus, setReviewStatus] = useState<Record<number, 'implemented' | 'missing' | 'pending'>>({});

  const handleMarkAsImplemented = (id: number) => {
    setReviewStatus(prev => ({
      ...prev,
      [id]: 'implemented'
    }));
  };

  const handleMarkAsMissing = (id: number) => {
    setReviewStatus(prev => ({
      ...prev,
      [id]: 'missing'
    }));
  };

  const getStatusIcon = (status: 'implemented' | 'missing' | 'pending' | undefined) => {
    if (status === 'implemented') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status === 'missing') {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return <div className="h-5 w-5 rounded-full border border-gray-300" />;
  };

  const getStatusText = (status: 'implemented' | 'missing' | 'pending' | undefined) => {
    if (status === 'implemented') return 'Implemented';
    if (status === 'missing') return 'Missing';
    return 'Pending Review';
  };

  const getStatusClass = (status: 'implemented' | 'missing' | 'pending' | undefined) => {
    if (status === 'implemented') return 'text-green-600';
    if (status === 'missing') return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chat Assistant Review</h1>
          <p className="text-muted-foreground">
            Review all static conversations for the Chat Assistant
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Static Conversations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review each conversation and mark as implemented or missing
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(reviewStatus[conversation.id])}
                      <span className={`text-sm font-medium ${getStatusClass(reviewStatus[conversation.id])}`}>
                        {getStatusText(reviewStatus[conversation.id])}
                      </span>
                    </div>
                    <h3 className="font-medium text-lg mb-2">Q: {conversation.question}</h3>
                    <p className="text-muted-foreground mb-3">A: {conversation.answer}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={reviewStatus[conversation.id] === 'implemented' ? 'default' : 'outline'}
                      onClick={() => handleMarkAsImplemented(conversation.id)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Implemented
                    </Button>
                    <Button
                      size="sm"
                      variant={reviewStatus[conversation.id] === 'missing' ? 'destructive' : 'outline'}
                      onClick={() => handleMarkAsMissing(conversation.id)}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Missing
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {Object.values(reviewStatus).filter(status => status !== 'pending').length} of {conversations.length} conversations reviewed
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setReviewStatus({})}>
            Reset All
          </Button>
          <Button>
            Save Review
          </Button>
        </div>
      </div>
    </div>
  );
}