import React from "react";
import { ClientSafeProvider, getProviders, getSession, LiteralUnion, signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { Box, Button, Typography } from "@mui/material";
import { RouteUrls } from "../../utility/config";
import { GetServerSideProps } from "next";

export default function Login({ providers }: { providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> }) {
  return (
    <Box>
      <Box>login</Box>

      {Object.values(providers).map((provider) => (
        <Box key={provider.id}>
          <Button onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
            <Typography>Login with {provider.name}</Typography>
          </Button>
        </Box>
      ))}
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  // If the session already exists, redirect to home
  if (session) {
    context.res.writeHead(302, { Location: RouteUrls.Home });
    context.res.end();

    return { props: {} };
  }

  // Get the providers that will be sent to the Login page (spotify provider, ..)
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};
