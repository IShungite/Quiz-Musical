import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch } from "../../hooks/reducer";
import { createPlayer } from "../../reducers/waitingAreaSlice";

export default function CreatePlayerForm() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");

  const onClickCreate = () => {
    dispatch(createPlayer({ name }));
  };

  return (
    <Box>
      <TextField type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <Button onClick={onClickCreate}>Créer</Button>
    </Box>
  );
}
