import { create } from 'zustand';
import { ChatMessage, ChatConversation } from '@/types/chat';
import chatConversations from '../data/chat-conversations.json';

interface ChatAssistantState {
  messages: ChatMessage[];
  isOpen: boolean;
  isMinimized: boolean;
  conversations: ChatConversation[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setOpen: (isOpen: boolean) => void;
  setMinimized: (isMinimized: boolean) => void;
  clearMessages: () => void;
  findMatchingConversation: (query: string) => ChatConversation | null;
}

export const useChatAssistantStore = create<ChatAssistantState>((set, get) => ({
  messages: [
    {
      id: '1',
      content: 'Hello! I\'m your Bondly CRM assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(),
    }
  ],
  isOpen: false,
  isMinimized: false,
  conversations: chatConversations,

  addMessage: (message) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date(),
      }
    ]
  })),

  setOpen: (isOpen) => set({ isOpen }),
  setMinimized: (isMinimized) => set({ isMinimized }),
  clearMessages: () => set({
    messages: [
      {
        id: '1',
        content: 'Hello! I\'m your Bondly CRM assistant. How can I help you today?',
        role: 'assistant',
        timestamp: new Date(),
      }
    ]
  }),

  findMatchingConversation: (query) => {
    const { conversations } = get();
    
    // First try exact match
    const exactMatch = conversations.find(
      convo => convo.question.toLowerCase() === query.toLowerCase()
    );
    
    if (exactMatch) return exactMatch;
    
    // Then try partial match
    const partialMatch = conversations.find(
      convo => 
        convo.question.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(convo.question.toLowerCase())
    );
    
    return partialMatch || null;
  }
}));