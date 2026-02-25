import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Resend({
            from: process.env.EMAIL_FROM,
            apiKey: process.env.RESEND_API_KEY,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    console.log("[AUTH] Authorize called with:", credentials);
                    if (
                        credentials?.email === "vineet@studymate.ai" &&
                        credentials?.password === "Vineet/18@"
                    ) {
                        console.log("[AUTH] Credentials match! Bypassing DB and returning demo user.");

                        return {
                            id: "demo-user-123",
                            name: "Vineet (Demo)",
                            email: "vineet@studymate.ai",
                            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vineet",
                        };
                    }
                    console.log("[AUTH] Invalid credentials");
                    return null;
                } catch (error) {
                    console.error("[AUTH ERROR] Failed inside authorize:", error);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        }
    }
});
