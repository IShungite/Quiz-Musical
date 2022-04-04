import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { RouteUrls } from "../../../utility/config";

const refreshAccessToken = async (token: JWT) => {
  // TODO Refresh token
  return { ...token, error: "RefreshAccessTokenError" };
};

export default NextAuth({
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: RouteUrls.Login,
    signOut: RouteUrls.Logout,
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token ?? "",
          refreshToken: account.refresh_token ?? "",
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at !== undefined ? account.expires_at * 1000 : 0, // we are handling expiry time in milliseconds hence * 1000
        };
      }

      if (Date.now() < token.accessTokenExpires) return token;

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});
