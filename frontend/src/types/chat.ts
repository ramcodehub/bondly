export interface ChatConversation {
  id: number;
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}