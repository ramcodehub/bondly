"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, MessageCircle, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useChatAssistantStore } from "@/lib/stores/use-chat-assistant-store";
import { ChatConversation } from "@/types/chat";
import "./../app/chat-styles.css";

export default function ChatAssistant() {
  const { 
    messages, 
    isOpen, 
    isMinimized, 
    setOpen, 
    setMinimized, 
    addMessage,
    findMatchingConversation
  } = useChatAssistantStore();
  
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Improved scroll to bottom with better performance
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        // Use smooth scrolling with a slight delay to ensure content is rendered
        setTimeout(() => {
          scrollViewport.scrollTo({
            top: scrollViewport.scrollHeight,
            behavior: 'smooth'
          });
        }, 10);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for custom event to open chat
  useEffect(() => {
    const handleOpenChat = () => {
      setOpen(true);
      setMinimized(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('openChatAssistant', handleOpenChat);
      return () => {
        window.removeEventListener('openChatAssistant', handleOpenChat);
      };
    }
  }, [setOpen, setMinimized]);

  const handleSend = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    addMessage({
      content: inputValue,
      role: "user"
    });

    // Find matching conversation
    const matchingConversation = findMatchingConversation(inputValue);
    
    // Simulate assistant response after a delay
    setTimeout(() => {
      const response = matchingConversation 
        ? matchingConversation.answer 
        : "I'm still learning! Please contact support or check documentation.";
      
      addMessage({
        content: response,
        role: "assistant"
      });
    }, 300);
    
    setInputValue("");
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    // Send automatically when clicking a quick question
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get predefined questions for quick suggestions
  const { conversations } = useChatAssistantStore();
  const quickQuestions = conversations.slice(0, 5); // Show first 5 questions as suggestions

  // Always render the component but control visibility with CSS
  return (
    <div className="chat-assistant-container">
      {!isOpen ? (
        <Button
          className="chat-assistant-button h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open chat assistant</span>
        </Button>
      ) : (
        <Card className={`chat-assistant-card w-80 h-[500px] flex flex-col transition-all duration-300 shadow-xl ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
          <CardHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <Bot className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-bold">Chat Assistant</span>
              </CardTitle>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  {showSuggestions ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setMinimized(!isMinimized)}
                >
                  {isMinimized ? (
                    <MessageCircle className="h-4 w-4" />
                  ) : (
                    <MessageCircle className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <>
              <CardContent className="flex-1 p-0 flex flex-col h-full">
                {/* Chat messages area */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  <ScrollArea 
                    ref={scrollAreaRef}
                    className="flex-1 p-4 pb-2"
                  >
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-gray-100 dark:bg-gray-800 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  {/* Quick Questions - now inside the chat box */}
                  {showSuggestions && quickQuestions.length > 0 && (
                    <div className="px-4 pb-3 border-t pt-3 bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-center mb-2">
                        <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-xs font-medium text-muted-foreground">Quick questions:</span>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                        {quickQuestions.map((conversation: ChatConversation) => (
                          <Button
                            key={conversation.id}
                            variant="outline"
                            size="sm"
                            className="h-auto py-1 px-2 text-xs leading-tight max-w-full"
                            onClick={() => handleQuickQuestion(conversation.question)}
                          >
                            <span className="truncate">{conversation.question}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Input area */}
                <div className="p-4 border-t bg-white dark:bg-gray-900">
                  <div className="flex space-x-2">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 resize-none"
                      rows={2}
                    />
                    <Button
                      onClick={handleSend}
                      size="icon"
                      className="h-10 w-10"
                      disabled={inputValue.trim() === ""}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      )}
    </div>
  );
}