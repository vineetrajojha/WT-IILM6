import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { exams } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function ExamsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const userExams = await db.query.exams.findMany({
        where: eq(exams.userId, session.user.id),
        orderBy: [desc(exams.createdAt)],
    });

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Exams</h1>
                    <p className="text-muted-foreground">Manage your study plans and subjects.</p>
                </div>
                <Link href="/exams/new">
                    <Button className="bg-brand-500 hover:bg-brand-600 text-white gap-2 text-sm">
                        <PlusCircle className="h-4 w-4" />
                        New Exam
                    </Button>
                </Link>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search exams..." className="pl-8" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userExams.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20 border-dashed">
                        <h3 className="mt-4 text-lg font-semibold">No Exams Found</h3>
                        <p className="mb-4 text-sm text-muted-foreground">You haven&apos;t added any exams yet.</p>
                        <Link href="/exams/new">
                            <Button>Create Exam</Button>
                        </Link>
                    </div>
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
                                        <Button variant="ghost" size="sm">Manage</Button>
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
