import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { exams } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const userExams = await db.query.exams.findMany({
        where: eq(exams.userId, session.user.id),
        orderBy: [desc(exams.createdAt)],
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {session.user.name || "Student"}!
                    </p>
                </div>
                <Link href="/exams/new">
                    <Button className="bg-brand-500 hover:bg-brand-600 text-white">New Exam</Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userExams.length === 0 ? (
                    <Card className="col-span-full border-dashed bg-muted/40">
                        <CardHeader className="text-center">
                            <CardTitle>No Exams Found</CardTitle>
                            <CardDescription>You haven&apos;t created any exams yet.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Link href="/exams/new">
                                <Button variant="outline">Create your first exam</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    userExams.map((exam) => (
                        <Card key={exam.id} className="hover:bg-muted/40 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl">{exam.subject}</CardTitle>
                                <CardDescription>
                                    Date: {format(new Date(exam.examDate), "MMMM d, yyyy")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mt-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${exam.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        exam.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                        {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                                    </span>
                                    <Link href={`/exams/${exam.id}`}>
                                        <Button variant="ghost" size="sm">View</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
