import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { exams, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function TimetablePage({ params }: { params: Promise<{ examId: string }> | { examId: string } }) {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) redirect("/login");

    const resolvedParams = await params;

    const [exam] = await db.select().from(exams).where(eq(exams.id, resolvedParams.examId));
    if (!exam || exam.userId !== sessionUser.user.id) redirect("/exams");

    const examSessions = await db.select().from(sessions).where(eq(sessions.examId, exam.id));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/exams/${exam.id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
                    <p className="text-muted-foreground">Your AI generated study schedule for {exam.subject}.</p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {examSessions.length === 0 ? (
                    <div className="p-8 text-center border rounded-lg bg-muted/20 border-dashed">
                        <p className="text-muted-foreground">No sessions scheduled. You can generate a timetable from your topics.</p>
                        <Button className="mt-4">Generate Timetable</Button>
                    </div>
                ) : (
                    <p>Implement Calendar View Here</p>
                )}
            </div>
        </div>
    );
}
