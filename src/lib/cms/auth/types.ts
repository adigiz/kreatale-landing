import "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    /** fingerprint of the password hash at login; a mismatch ends the session */
    pw?: string;
    /** when the user logged in (ms), for the absolute session limit */
    loginAt?: number;
    accessTokenExpires?: number;
    error?: string;
  }
}


