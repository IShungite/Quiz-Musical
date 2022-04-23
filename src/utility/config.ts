export enum RouteUrls {
  Index = "/",
  Home = "/home",
  NewQuiz = "/home/new-quiz",
  Login = "/auth/login",
  Logout = "/auth/logout",
  WaitingArea = "/home/waiting-area",
  Quiz = "/home/quiz",
}

export const isDev = process.env.NODE_ENV === "development";

export const serverUrl = isDev ? "http://localhost:3000" : "https://quiz-musical.vercel.app";

// process.env.PUSHER_APP_KEY // RETURN UNDEFINED
export const pusherAppkey = "97911bb6f66dab3d9595";

export const AppName = "Quiz Musical";
