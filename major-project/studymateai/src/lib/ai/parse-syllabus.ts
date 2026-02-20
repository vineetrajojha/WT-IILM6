import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { PROMPTS } from './prompts';

const TopicSchema = z.object({
    title: z.string(),
    weight: z.number().min(1).max(10),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    subtopics: z.array(z.string()),
});

const SyllabusSchema = z.object({
    subject: z.string(),
    units: z.array(z.object({
        title: z.string(),
        topics: z.array(TopicSchema),
    }))
});

export async function parseSyllabus(raw: string) {
    const { object } = await generateObject({
        model: anthropic('claude-3-5-sonnet-20241022'), // using actual string available in latest ai-sdk
        schema: SyllabusSchema,
        prompt: PROMPTS.parseSyllabus(raw),
    });
    return object;
}
