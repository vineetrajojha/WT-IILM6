export const PROMPTS = {
    parseSyllabus: (raw: string) => `
You are an expert academic curriculum analyst.
Parse the following syllabus text into a structured JSON output.

Rules:
- Extract every unique topic and subtopic
- Assign a difficulty score (easy | medium | hard) based on topic complexity keywords
- Assign a weight (1–10) based on how much space the topic takes relative to the full syllabus
- Group topics under their parent unit/chapter if possible.
- If it's a flat list, just consider them as individual topics.

Syllabus:
"""
${raw}
"""
`,

    generateTimetable: (examDate: string, today: string, daysRemaining: number) => `
You are an expert study planner.
Generate a structured study timetable.

Rules:
- The exam is on ${examDate}
- Today is ${today}
- Days remaining: ${daysRemaining}
- Distribute the topics logically.
`,

    replan: () => `Replan`,
    generateFlashcards: (topic: string, context: string) => `Generate flashcards for ${topic} given ${context}`,
};
