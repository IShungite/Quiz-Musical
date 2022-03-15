import Head from "next/head";
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
        {children}
      </main>

      <footer></footer>
    </div>
  );
}
