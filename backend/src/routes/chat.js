import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// GET /api/chat/conversations - Fetch chat conversations
router.get('/conversations', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('id, question, answer, category')
      .order('id');

    if (error) throw error;

    const conversations = data.map(conversation => ({
      id: conversation.id,
      question: conversation.question,
      answer: conversation.answer,
      category: conversation.category
    }));

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Error fetching chat conversations:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch chat conversations',
      error: error.message 
    });
  }
});

export default router;