// src/services/openai.ts
import OpenAI from 'openai'; // Importação atualizada
import dotenv from 'dotenv';

dotenv.config();

// Configuração nova (v4+)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePost(especialidade: string, tipo: string): Promise<string> {
  const prompt = `
    Gere um post para ${especialidade} (tipo: ${tipo}) conforme normas do CFM.
    Regras:
    - Evite palavras como "cura", "garantia" ou "100% eficaz".
    - Inclua 3 dicas curtas e hashtags.
    - Formato: Emoji + Dica + Quebra de linha.
  `;

  // Chamada atualizada (v4+)
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0]?.message?.content || '';
}