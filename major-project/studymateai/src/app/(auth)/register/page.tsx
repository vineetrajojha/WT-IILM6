import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-muted/40">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                    <p className="text-sm text-muted-foreground">Get started with StudymateAI</p>
                </div>

                <form
                    action={async () => {
                        "use server";
                        await signIn("google", { redirectTo: "/dashboard" });
                    }}
                >
                    <Button type="submit" variant="default" className="w-full bg-brand-500 hover:bg-brand-600 text-white">
                        Sign up with Google
                    </Button>
                </form>

                <p className="px-8 text-center text-sm text-muted-foreground">
                    <Link href="/login" className="hover:text-brand underline underline-offset-4">
                        Already have an account? Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
