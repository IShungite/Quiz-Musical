import { LoadingButton } from "@mui/lab";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CreatePlayerDialog from "../../components/CreatePlayerDialog/CreatePlayerDialog";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { FetchStatus } from "../../models/FetchStatus";
import { joinGame, resetJoinGameStatus } from "../../reducers/quizSlice";
import { RouteUrls } from "../../utility/config";

export default function JoinQuiz() {
  const dispatch = useAppDispatch();

  const { currentPlayer, joinGameStatus } = useAppSelector((state) => state.quiz);

  const [gameId, setGameId] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();

  const handleChangeGameId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameId(event.target.value);
  };

  const handleClickJoin = () => {
    if (!currentPlayer) setDialogOpen(true);
    else dispatch(joinGame({ gameId, playerId: currentPlayer._id }));
  };

  useEffect(() => {
    if (joinGameStatus === FetchStatus.Finished) {
      router.push(RouteUrls.Quiz);
    }
  }, [joinGameStatus, router]);

  useEffect(() => {
    return () => {
      dispatch(resetJoinGameStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!currentPlayer) {
      setDialogOpen(true);
    }
  }, [currentPlayer]);

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h2">Rejoindre une partie</Typography>
      </Box>

      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <TextField id="game-id" label="Numéro de la partie" onChange={handleChangeGameId} />
        </Grid>
        <Grid item>
          <LoadingButton variant="contained" onClick={handleClickJoin} loading={joinGameStatus === FetchStatus.Loading}>
            Rejoindre
          </LoadingButton>
        </Grid>
      </Grid>
      <CreatePlayerDialog open={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
}
