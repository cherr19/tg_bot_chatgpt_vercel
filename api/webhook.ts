import type { VercelRequest, VercelResponse } from '@vercel/node'
import bot from '../bot'
import { Configuration, OpenAIApi } from 'openai'; 

export default async function (req: VercelRequest, res: VercelResponse) {
  const { body } = req
  const { chat: { id }, text } = body.message
  

// Создай/обнови экземпляр OpenAIApi, если у тебя его нет:
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, 
});
const openai = new OpenAIApi(configuration);

// А здесь вместо отправки текста пользователю добавь вызов ChatGPT:
const response = await openai.createChatCompletion({
  model: 'gpt-3.5-turbo', // или другая модель
  messages: [{ role: 'user', content: text }],
  max_tokens: 3000,
});

const reply = response.data.choices[0].message?.content.trim() || '';

await bot.sendMessage(id, reply);

  res.status(204).send('')
}
