import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const priority = z.enum(['P0', 'P1', 'P2', 'P3']).default('P2');

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    modifiedDate: z.coerce.date().optional(),
    author: z.string().default('Diet Cherry Coke Team'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    priority,
    locale: z.string().default('en'),
    draft: z.boolean().default(false),
  }),
});

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/recipes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date().optional(),
    prepTime: z.string(),
    cookTime: z.string(),
    servings: z.number(),
    ingredients: z.array(z.string()),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    category: z.string(),
    priority,
    locale: z.string().default('en'),
    draft: z.boolean().default(false),
  }),
});

const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/comparisons' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date().optional(),
    productA: z.object({
      name: z.string(),
      brand: z.string().optional(),
    }),
    productB: z.object({
      name: z.string(),
      brand: z.string().optional(),
    }),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    verdict: z.string(),
    priority,
    locale: z.string().default('en'),
    draft: z.boolean().default(false),
  }),
});

const retailers = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/retailers' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    retailerName: z.string(),
    retailerUrl: z.string().url(),
    availability: z.enum(['in-stock', 'limited', 'out-of-stock', 'unknown']),
    priceRange: z.string(),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    priority,
    locale: z.string().default('en'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, recipes, comparisons, retailers };
