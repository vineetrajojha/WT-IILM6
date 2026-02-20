import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { exams, topics } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TopicsPage({ params }: { params: Promise<{ examId: string }> | { examId: string } }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const resolvedParams = await params;

    const [exam] = await db.select().from(exams).where(eq(exams.id, resolvedParams.examId));
    if (!exam || exam.userId !== session.user.id) redirect("/exams");

    const examTopics = await db.select().from(topics).where(eq(topics.examId, exam.id));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/exams/${exam.id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Topics for {exam.subject}</h1>
                    <p className="text-muted-foreground">Manage the subtopics from your syllabus.</p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {examTopics.length === 0 ? (
                    <div className="p-8 text-center border rounded-lg bg-muted/20 border-dashed">
                        <p className="text-muted-foreground">No topics found. Return to the exam to parse your syllabus.</p>
                    </div>
                ) : (
                    examTopics.map(topic => (
                        <Card key={topic.id}>
                            <CardHeader className="py-3">
                                <CardTitle className="text-lg flex justify-between">
                                    <span>{topic.title}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${topic.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                            topic.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {topic.difficulty}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 text-sm text-muted-foreground">
                                Weight: {topic.weight}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
