import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-muted/40">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">Sign in to your account</p>
                </div>

                <form
                    action={async () => {
                        "use server";
                        await signIn("google", { redirectTo: "/dashboard" });
                    }}
                >
                    <Button type="submit" variant="outline" className="w-full">
                        Sign in with Google
                    </Button>
                </form>

                <p className="px-8 text-center text-sm text-muted-foreground">
                    <Link href="/register" className="hover:text-brand underline underline-offset-4">
                        Don&apos;t have an account? Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
