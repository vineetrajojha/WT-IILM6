import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { parseSyllabus } from "@/lib/ai/parse-syllabus";
import { db } from "@/lib/db";
import { topics } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";

const RequestSchema = z.object({
    examId: z.string(),
    syllabusText: z.string().min(10),
});

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    try {
        const result = await parseSyllabus(parsed.data.syllabusText);

        // Insert into DB
        let orderIndex = 0;
        const topicsToInsert = [];

        for (const unit of result.units) {
            const unitId = createId();
            topicsToInsert.push({
                id: unitId,
                examId: parsed.data.examId,
                title: unit.title,
                weight: 1,
                difficulty: "medium" as const,
                orderIndex: orderIndex++,
                parentId: null,
            });

            for (const topic of unit.topics) {
                topicsToInsert.push({
                    id: createId(),
                    examId: parsed.data.examId,
                    title: topic.title,
                    weight: topic.weight,
                    difficulty: topic.difficulty as "easy" | "medium" | "hard",
                    orderIndex: orderIndex++,
                    parentId: unitId,
                });
            }
        }

        if (topicsToInsert.length > 0) {
            await db.insert(topics).values(topicsToInsert);
        }

        return NextResponse.json({ data: result });
    } catch (error) {
        console.error("[parse-syllabus]", error);
        return NextResponse.json({ error: "Failed to parse syllabus" }, { status: 500 });
    }
}
