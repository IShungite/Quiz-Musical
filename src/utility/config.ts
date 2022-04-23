export enum RouteUrls {
  Index = "/",
  Home = "/home",
  NewQuiz = "/home/new-quiz",
  JoinQuiz = "/home/join-quiz",
  Quiz = "/home/quiz",
  Login = "/auth/login",
  Logout = "/auth/logout",
}

export const isDev = process.env.NODE_ENV === "development";

export const serverUrl = isDev ? "http://localhost:3000" : "https://quiz-musical.vercel.app";

// process.env.PUSHER_APP_KEY // RETURN UNDEFINED
export const pusherAppkey = "97911bb6f66dab3d9595";

export const AppName = "Quiz Musical";
