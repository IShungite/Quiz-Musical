import { Box, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { createPlayer, resetCreatePlayerStatus } from "../../reducers/quizSlice";
import { LoadingButton } from "@mui/lab";
import { FetchStatus } from "../../models/FetchStatus";

export default function CreatePlayerForm() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");

  const { createPlayerStatus } = useAppSelector((state) => state.quiz);

  const handleClickCreate = () => {
    dispatch(createPlayer({ name }));
  };

  // Reset createPlayerStatus when component is unmounted
  useEffect(() => {
    return () => {
      dispatch(resetCreatePlayerStatus());
    };
  }, [dispatch]);

  return (
    <Grid container sx={{ pt: 1 }} alignItems="center" spacing={1}>
      <Grid item>
        <TextField label="Nouveau joueur" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </Grid>
      <Grid item>
        <LoadingButton variant="contained" loading={createPlayerStatus === FetchStatus.Loading} onClick={handleClickCreate}>
          Créer
        </LoadingButton>
      </Grid>
    </Grid>
  );
}
