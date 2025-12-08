const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Lazy load OpenAI only if key is set
let openai;
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai');
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

router.post('/chat', auth, async (req, res, next) => {
  try {
    if (!openai) {
      return res.status(503).json({ error: 'AI service not configured. Set OPENAI_API_KEY in backend .env' });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const systemPrompt = `You are Ustawi AI, a compassionate mental health and career guidance assistant for Kenyan youth. Respond with empathy and culturally relevant advice. Support both English and Swahili.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.json({ reply });
  } catch (err) {
    console.error('AI error:', err);
    if (err.status === 401) {
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    }
    next(err);
  }
});

module.exports = router;
