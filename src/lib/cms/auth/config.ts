import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db, users } from "../db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { canAccessAdmin, type UserRole } from "../permissions";
import { getServerSession } from "next-auth";

/** How often (in seconds) to re-validate the JWT against the DB */
const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes

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
      // Initial sign-in: populate token with user data and set expiry
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role: string }).role;
        token.name = (user as { name: string | null }).name;
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_MAX_AGE * 1000;
        return token;
      }

      // Token is still fresh -- return as-is
      if (
        typeof token.accessTokenExpires === "number" &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      // Access window expired -- rotate by re-fetching from DB
      try {
        const [freshUser] = await db
          .select({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
          })
          .from(users)
          .where(eq(users.id, token.id as string))
          .limit(1);

        if (!freshUser) {
          // User deleted -- mark token as expired so session callback can handle it
          token.error = "UserNotFound";
          return token;
        }

        // Update token with fresh data from DB
        token.role = freshUser.role;
        token.name = freshUser.name;
        token.email = freshUser.email;
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_MAX_AGE * 1000;
        delete token.error;
      } catch {
        // DB error -- keep existing token data, try again next time
        // Set a shorter retry window (1 minute)
        token.accessTokenExpires = Date.now() + 60 * 1000;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as {
          id: string;
          role: string;
          name: string | null;
          error?: string;
        };
        sessionUser.id = token.id as string;
        sessionUser.role = token.role as string;
        sessionUser.name = token.name as string | null;

        // Propagate error to client so it can handle sign-out
        if (token.error) {
          sessionUser.error = token.error as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/en/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days (overall session / refresh window)
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper function to get session
export async function getSession() {
  try {
    return await getServerSession(authOptions);
  } catch {
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
  if (!canAccessAdmin(role as UserRole)) {
    throw new Error("Forbidden: Admin access required");
  }
  return session;
}
