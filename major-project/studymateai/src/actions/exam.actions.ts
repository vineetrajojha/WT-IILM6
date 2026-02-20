"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { exams } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

const CreateExamSchema = z.object({
    subject: z.string().min(1, "Subject is required").max(100),
    examDate: z.coerce.date(),
});

export async function createExam(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const parsed = CreateExamSchema.parse({
        subject: formData.get("subject"),
        examDate: formData.get("examDate"),
    });

    const [exam] = await db
        .insert(exams)
        .values({
            id: createId(),
            userId: session.user.id,
            ...parsed,
        })
        .returning();

    revalidatePath("/dashboard");
    revalidatePath("/exams");
    return exam;
}

export async function deleteExam(examId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.delete(exams).where(eq(exams.id, examId));

    revalidatePath("/dashboard");
    revalidatePath("/exams");
    return { success: true };
}
