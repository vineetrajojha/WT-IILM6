import Link from "next/link";

export function Header() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold md:hidden">
                <span>StudymateAI</span>
            </Link>
            <div className="ml-auto flex items-center gap-4">
                {/* User menu here */}
            </div>
        </header>
    );
}
