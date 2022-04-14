namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    NEXTAUTH_SECRET: string;
    MONGODB_URL: string;
  }
}
