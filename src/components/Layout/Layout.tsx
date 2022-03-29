import { Container } from "@mui/material";
import Head from "next/head";
import Script from "next/script";
import React from "react";
import AppBar from "../AppBar/AppBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Head>
        <title>Quiz musical</title>
        <meta name="description" content="Quiz musical" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <AppBar />
        <Container>{children}</Container>
      </main>

      {/* <Script type="text/javascript" src="https://e-cdn-files.dzcdn.net/js/min/dz.js" /> */}
      <footer></footer>
    </div>
  );
}
