import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function FlashcardsPage({ params }: { params: Promise<{ examId: string }> | { examId: string } }) {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) redirect("/login");
    const resolvedParams = await params;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/exams/${resolvedParams.examId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
                    <p className="text-muted-foreground">Review auto-generated flashcards.</p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20 border-dashed h-[300px]">
                <h3 className="text-lg font-semibold mb-2">No Flashcards Yet</h3>
                <p className="text-muted-foreground mb-4">You need to learn topics before reviewing flashcards.</p>
                <Button>Generate AI Flashcards</Button>
            </div>
        </div>
    );
}
