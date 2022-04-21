namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    NEXTAUTH_SECRET: string;
    NEXT_PUBLIC_KEY: string;
    MONGODB_URL: string;
    PUSHER_APP_ID: string;
    PUSHER_APP_KEY: string;
    PUSHER_APP_SECRET: string;
    PUSHER_APP_CLUSTER: string;
  }
}
