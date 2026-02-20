import Link from "next/link";
import { BookOpen, Calendar, LayoutDashboard, Settings } from "lucide-react";

export function Sidebar() {
    return (
        <div className="hidden border-r bg-muted/40 md:block min-h-screen">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <BookOpen className="h-6 w-6" />
                        <span>StudymateAI</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/exams"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Calendar className="h-4 w-4" />
                            Exams
                        </Link>
                        <Link
                            href="/settings"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Settings className="h-4 w-4" />
                            Settings
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}
