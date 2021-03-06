import * as React from "react";
import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import createEmotionCache from "../utility/createEmotionCache";
import lightThemeOptions from "../styles/themes/lightThemeOptions";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

import Layout from "../components/Layout/Layout";

import store from "../utility/store";
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const lightTheme = createTheme(lightThemeOptions);

const MyApp = (props: MyAppProps) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { session, ...pageProps },
  } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <SessionProvider session={session}>
          <Provider store={store}>
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
