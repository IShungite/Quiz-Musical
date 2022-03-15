import React from "react";
import { ClientSafeProvider, getProviders, LiteralUnion, signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { Box, Button, Typography } from "@mui/material";

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

export const getServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};
