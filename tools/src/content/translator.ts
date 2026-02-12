import OpenAI from 'openai';

const LANG_NAMES: Record<string, string> = {
  ko: 'Korean (한국어)',
  ja: 'Japanese (日本語)',
  en: 'English',
};

export async function translate(
  text: string,
  targetLang: string,
  opts?: { model?: string; context?: string }
): Promise<string> {
  const langName = LANG_NAMES[targetLang] || targetLang;
  const model = opts?.model || 'gpt-4o-mini';

  const openai = new OpenAI();

  const prompt = `Translate the following content into ${langName}.

Rules:
- Produce natural, fluent ${langName} — not a literal translation
- Preserve all markdown formatting (headers, links, bold, etc.)
- Keep URLs and brand names (Diet Cherry Coke, dietcherrycoke.net) unchanged
- Adapt cultural references to feel natural for ${langName} readers
- Maintain the same tone and style as the original
${opts?.context ? `\nContext: ${opts.context}` : ''}

Content to translate:
${text}`;

  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 4000,
  });

  return response.choices[0]?.message?.content?.trim() || '';
}
