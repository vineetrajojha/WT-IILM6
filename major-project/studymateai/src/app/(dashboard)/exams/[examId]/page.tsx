import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { exams, topics } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowLeft, BookOpen, Calendar, BrainCircuit } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ExamOverviewPage({ params }: { params: Promise<{ examId: string }> | { examId: string } }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    // Await params safely for both Next14 and Next15 compatibility
    const resolvedParams = await params;

    const [exam] = await db.select().from(exams).where(eq(exams.id, resolvedParams.examId));
    if (!exam || exam.userId !== session.user.id) redirect("/exams");

    const examTopics = await db.select().from(topics).where(eq(topics.examId, exam.id));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/exams">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{exam.subject}</h1>
                    <p className="text-muted-foreground">
                        Exam Date: {format(new Date(exam.examDate), "MMMM d, yyyy")} • Status: {exam.status}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Link href={`/exams/${exam.id}/topics`} className="block">
                    <Card className="hover:bg-muted/40 transition-colors h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-brand-500" />
                                Topics ({examTopics.length})
                            </CardTitle>
                            <CardDescription>View and manage your syllabus topics</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
                <Link href={`/exams/${exam.id}/timetable`} className="block">
                    <Card className="hover:bg-muted/40 transition-colors h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-brand-500" />
                                Timetable
                            </CardTitle>
                            <CardDescription>Your optimized AI-generated study schedule</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
                <Link href={`/exams/${exam.id}/flashcards`} className="block">
                    <Card className="hover:bg-muted/40 transition-colors h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BrainCircuit className="h-5 w-5 text-brand-500" />
                                Flashcards
                            </CardTitle>
                            <CardDescription>Review auto-generated flashcards for your topics</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
