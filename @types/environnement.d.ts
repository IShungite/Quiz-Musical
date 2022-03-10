namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    NEXTAUTH_URL: string;
    SPOTIFY_PUBLIC_CLIENT_ID: string;
    SPOTIFY_PUBLIC_CLIENT_SECRET: string;
    JWT_SECRET: string;
  }
}
