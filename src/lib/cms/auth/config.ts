import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db, users } from "../db";
import { eq, sql } from "drizzle-orm";
import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { canAccessAdmin, type UserRole } from "../permissions";
import { getEffectivePermissions } from "../permissions.server";
import { permissionIncludes } from "../permissions";
import { getServerSession } from "next-auth";

/** How often (in seconds) to re-validate the JWT against the DB */
const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes
/** Signed out after this long without opening the admin. */
const IDLE_TIMEOUT = 12 * 60 * 60; // 12 hours
/** Signed out this long after logging in, however active. */
const ABSOLUTE_TIMEOUT = 7 * 24 * 60 * 60; // 7 days

/**
 * A short fingerprint of the stored password hash. When the password changes the fingerprint
 * changes, so other signed-in sessions end at their next check (within 15 minutes).
 */
const passwordStamp = (hash: string) => createHash("sha256").update(hash).digest("base64url").slice(0, 16);

/**
 * Brute-force guard: after 5 failed attempts on one email, or 20 from one IP, logins are
 * refused for 15 minutes. Kept in memory, which suits the single standalone server.
 */
const FAIL_WINDOW = 15 * 60 * 1000;
const failures = new Map<string, { n: number; until: number }>();
const isLocked = (key: string, max: number) => {
  const f = failures.get(key);
  if (!f || f.until < Date.now()) return false;
  return f.n >= max;
};
const recordFailure = (key: string) => {
  const f = failures.get(key);
  if (!f || f.until < Date.now()) failures.set(key, { n: 1, until: Date.now() + FAIL_WINDOW });
  else f.n++;
  if (failures.size > 5000) for (const [k, v] of failures) if (v.until < Date.now()) failures.delete(k);
};
// compared against when the email isn't found, so both cases take the same time
const DUMMY_HASH = bcrypt.hashSync("no-such-user", 10);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const email = String(credentials.email).trim().toLowerCase();
        const fwd = req?.headers?.["x-forwarded-for"];
        const ip = (Array.isArray(fwd) ? fwd[0] : fwd || "").split(",")[0].trim() || "unknown";
        if (isLocked(`e:${email}`, 5) || isLocked(`i:${ip}`, 20)) {
          throw new Error("Too many attempts. Try again in 15 minutes.");
        }

        const [user] = await db
          .select()
          .from(users)
          .where(sql`lower(${users.email}) = ${email}`)
          .limit(1);

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user?.passwordHash || DUMMY_HASH
        );

        if (!user || !isValid) {
          recordFailure(`e:${email}`);
          recordFailure(`i:${ip}`);
          return null;
        }
        failures.delete(`e:${email}`);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          pw: passwordStamp(user.passwordHash),
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
        token.pw = (user as { pw?: string }).pw;
        token.loginAt = Date.now();
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_MAX_AGE * 1000;
        return token;
      }

      // Already ended, or past the absolute limit: stays ended until the user logs in again
      if (token.error) return token;
      if (typeof token.loginAt !== "number" || Date.now() - token.loginAt > ABSOLUTE_TIMEOUT * 1000) {
        token.error = "SessionExpired";
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
            passwordHash: users.passwordHash,
          })
          .from(users)
          .where(eq(users.id, token.id as string))
          .limit(1);

        if (!freshUser) {
          // User deleted -- mark token as expired so session callback can handle it
          token.error = "UserNotFound";
          return token;
        }

        // Password changed since this session logged in
        if (token.pw !== passwordStamp(freshUser.passwordHash)) {
          token.error = "SessionExpired";
          return token;
        }

        // Update token with fresh data from DB
        token.role = freshUser.role;
        token.name = freshUser.name;
        token.email = freshUser.email;
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_MAX_AGE * 1000;
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
    // With JWT sessions NextAuth re-issues the cookie on every session check (updateAge only
    // applies to database sessions), so the cookie always runs IDLE_TIMEOUT from the last page
    // load or tab focus. The admin doesn't poll, so a session left alone ends after 12 hours.
    // ABSOLUTE_TIMEOUT caps any session at 7 days however active.
    maxAge: IDLE_TIMEOUT,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper function to get session
export async function getSession() {
  try {
    const session = await getServerSession(authOptions);
    // an expired, revoked or deleted-user session counts as signed out
    if ((session?.user as { error?: string } | undefined)?.error) return null;
    return session;
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

/**
 * Require admin access and a specific permission (DB-backed).
 * Use this in API routes and server actions so role customizations in the DB are enforced.
 */
export async function requirePermission(permission: string) {
  const session = await requireAdmin();
  const permissions = await getEffectivePermissions(
    (session.user as { role: string }).role
  );
  if (!permissionIncludes(permissions, permission)) {
    throw new Error("Forbidden: Insufficient permissions");
  }
  return session;
}
