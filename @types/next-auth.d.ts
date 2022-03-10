import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

/** Example on how to extend the built-in session types */
declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
      username: string;
    };
  }
}

/** Example on how to extend the built-in types for JWT */
declare module "next-auth/jwt" {
  interface JWT {
    accessTokenExpires: number;
    accessToken: string;
    refreshToken: string;
    username: string;
  }
}
