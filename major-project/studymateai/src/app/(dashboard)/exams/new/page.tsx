import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ExamForm } from "@/components/exams/ExamForm";

export default async function NewExamPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Exam</h1>
                <p className="text-muted-foreground">Add a new subject and syllabus to generate a study plan.</p>
            </div>
            <ExamForm />
        </div>
    );
}
