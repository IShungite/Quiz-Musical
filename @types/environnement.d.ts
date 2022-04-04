namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
  }
}
