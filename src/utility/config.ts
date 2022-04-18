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
