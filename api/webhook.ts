import type { VercelRequest, VercelResponse } from '@vercel/node';
import bot from '../bot';
import { OpenAI } from 'openai';

// Создаем экземпляр OpenAI с использованием вашего API-ключа
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function (req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('Received request:', req.method);

  if (req.method !== 'POST') {
    res.status(404).send('Not Found');
    return;
  }

  const { body } = req;
  console.log('Request body:', body);

  if (body && body.message) {
    const { chat: { id }, text } = body.message;
    console.log('Chat ID:', id, 'Message:', text);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: text }],
        max_tokens: 150,
      });

      const reply = response.choices[0]?.message?.content?.trim() || '';

      console.log('Reply from OpenAI:', reply);

      if (reply) {
        await bot.sendMessage(id, reply);
      }
