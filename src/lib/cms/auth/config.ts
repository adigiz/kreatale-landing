import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db, users } from "../db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { canAccessAdmin } from "../permissions";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role: string }).role;
        token.name = (user as { name: string | null }).name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string; role: string; name: string | null }).id = token.id as string;
        (session.user as { id: string; role: string; name: string | null }).role = token.role as string;
        (session.user as { id: string; role: string; name: string | null }).name = token.name as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/en/admin/login", // Default locale, will be handled by middleware
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper function to get session (replaces auth() from v5)
export async function getSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

// Helper function to check if user can access admin
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  const role = (session.user as { role: string }).role;
  if (!canAccessAdmin(role as "super_admin" | "admin" | "editor" | "author" | "viewer")) {
    throw new Error("Forbidden: Admin access required");
  }
  return session;
}


