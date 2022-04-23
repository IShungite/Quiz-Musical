import { Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { createPlayer, resetCreatePlayerStatus } from "../../reducers/quizSlice";
import { LoadingButton } from "@mui/lab";
import { FetchStatus } from "../../models/FetchStatus";

export default function CreatePlayerForm() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");

  const { createPlayerStatus } = useAppSelector((state) => state.quiz);

  const onClickCreate = () => {
    dispatch(createPlayer({ name }));
  };

  // Reset createPlayerStatus when component is unmounted
  useEffect(() => {
    return () => {
      dispatch(resetCreatePlayerStatus());
    };
  }, [dispatch]);

  return (
    <Box>
      <TextField label="Nouveau joueur" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <LoadingButton loading={createPlayerStatus === FetchStatus.Loading} onClick={onClickCreate}>
        Créer
      </LoadingButton>
    </Box>
  );
}
