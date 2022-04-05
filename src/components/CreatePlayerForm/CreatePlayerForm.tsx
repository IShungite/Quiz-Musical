import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";

type Props = {
  onClickCreate: (name: string) => void;
};

export default function CreatePlayerForm({ onClickCreate }: Props) {
  const [name, setName] = useState("");

  return (
    <Box>
      <TextField type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <Button
        onClick={() => {
          onClickCreate(name);
        }}
      >
        Create
      </Button>
    </Box>
  );
}
