const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

const router = express.Router();

// --- Configuration ---
const PROVIDER = process.env.AI_PROVIDER || 'gemini';

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
  : null;

// Initialize DeepSeek (via OpenAI SDK)
const deepseek = process.env.DEEPSEEK_API_KEY 
  ? new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY
    })
  : null;

console.log(`AI Service initialized. Selected Provider: ${PROVIDER.toUpperCase()}`);

// --- Helper Functions ---

async function generateWithDeepSeek(prompt, history) {
  if (!deepseek) throw new Error('DeepSeek API key not configured');
  
  const messages = [
    { role: 'system', content: prompt },
    ...history.slice(-8), // Context window
  ];

  const completion = await deepseek.chat.completions.create({
    messages: messages,
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    temperature: 0.7,
    max_tokens: 500
  });

  return completion.choices[0].message.content;
}

async function generateWithGemini(systemPrompt, history, message) {
  if (!genAI) throw new Error('Gemini API key not configured');

  const model = genAI.getGenerativeModel({ 
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' 
  });

  // Format history for Gemini (it doesn't support system role in chat history the same way)
  let fullPrompt = systemPrompt + '\n\n';
  
  history.slice(-8).forEach(msg => {
    if (msg.role === 'user') {
      fullPrompt += `User: ${msg.content}\n`;
    } else if (msg.role === 'assistant') {
      fullPrompt += `Ustawi: ${msg.content}\n`;
    }
  });
  
  fullPrompt += `User: ${message}\nUstawi:`;

  const result = await model.generateContent(fullPrompt);
  return result.response.text();
}

// --- Route ---

router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are Ustawi, a compassionate AI therapist and career advisor for young Kenyans. 
Provide empathetic, culturally relevant guidance on mental health, career choices, and wellness.
Use simple language and offer practical, actionable advice.
Be warm, supportive, and understanding. Keep responses concise but helpful (under 200 words).`;

    let reply;

    if (PROVIDER === 'deepseek') {
      // Prepare history for DeepSeek including the current message
      const historyWithCurrent = [...conversationHistory, { role: 'user', content: message }];
      reply = await generateWithDeepSeek(systemPrompt, historyWithCurrent);
    } else {
      // Default to Gemini
      reply = await generateWithGemini(systemPrompt, conversationHistory, message);
    }

    res.json({ reply });

  } catch (err) {
    console.error(`${PROVIDER} AI error:`, err);
    
    // Error handling
    let status = 500;
    let errorMsg = 'AI service temporarily unavailable.';

    if (err.status === 402 || err.message?.includes('Insufficient Balance')) {
      status = 402;
      errorMsg = 'AI service quota exceeded (Insufficient Balance).';
    } else if (err.status === 429) {
      status = 429;
      errorMsg = 'AI service is busy. Please try again in a moment.';
    } else if (err.status === 401) {
      errorMsg = 'AI service configuration error (Invalid Key).';
    }

    res.status(status).json({ error: errorMsg });
  }
});

module.exports = router;
