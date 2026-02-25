"use server";

import { auth } from "@/lib/auth";
import { dummyExams } from "@/lib/dummy-data";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";

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

    const exam = {
        id: createId(),
        userId: session.user.id,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        ...parsed,
    };
    dummyExams.push(exam as any);

    revalidatePath("/dashboard");
    revalidatePath("/exams");
    return exam;
}

export async function deleteExam(examId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const idx = dummyExams.findIndex(e => e.id === examId);
    if (idx !== -1) dummyExams.splice(idx, 1);

    revalidatePath("/dashboard");
    revalidatePath("/exams");
    return { success: true };
}
