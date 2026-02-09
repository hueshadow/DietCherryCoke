import { getCollection } from 'astro:content';

export async function GET() {
  const [articles, recipes, comparisons, retailers] = await Promise.all([
    getCollection('articles'),
    getCollection('recipes'),
    getCollection('comparisons'),
    getCollection('retailers'),
  ]);

  const index = [
    ...articles
      .filter((a) => !a.data.draft)
      .map((a) => ({
        title: a.data.title,
        description: a.data.description,
        url: `/articles/${a.id}`,
        category: 'article',
        content: stripMarkdown(a.body ?? '').slice(0, 300),
      })),
    ...recipes
      .filter((r) => !r.data.draft)
      .map((r) => ({
        title: r.data.title,
        description: r.data.description,
        url: `/recipes/${r.id}`,
        category: 'recipe',
        content: stripMarkdown(r.body ?? '').slice(0, 300),
      })),
    ...comparisons
      .filter((c) => !c.data.draft)
      .map((c) => ({
        title: c.data.title,
        description: c.data.description,
        url: `/compare/${c.id}`,
        category: 'comparison',
        content: stripMarkdown(c.body ?? '').slice(0, 300),
      })),
    ...retailers
      .filter((r) => !r.data.draft)
      .map((r) => ({
        title: r.data.title,
        description: r.data.description,
        url: `/where-to-buy/${r.id}`,
        category: 'retailer',
        content: stripMarkdown(r.body ?? '').slice(0, 300),
      })),
  ];

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`>]/g, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\n/g, ' ')
    .trim();
}
