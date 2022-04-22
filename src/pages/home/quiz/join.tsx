import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CreatePlayerForm from "../../../components/CreatePlayerForm/CreatePlayerForm";
import { useAppDispatch, useAppSelector } from "../../../hooks/reducer";
import { joinGame, resetCreatePlayerStatus, WaitingAreaStatus } from "../../../reducers/waitingAreaSlice";

export default function Join() {
  const dispatch = useAppDispatch();

  const { currentPlayer, joinGameStatus } = useAppSelector((state) => state.waitingArea);

  const [gameId, setGameId] = useState("");

  const router = useRouter();

  const handleChangeGameId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameId(event.target.value);
  };

  useEffect(() => {
    if (joinGameStatus === WaitingAreaStatus.Finished) {
      router.push("/home/quiz");
    }
  }, [joinGameStatus, router]);

  useEffect(() => {
    return () => {
      dispatch(resetCreatePlayerStatus());
    };
  }, [dispatch]);

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h2">Rejoindre une partie</Typography>
      </Box>
      <Box>
        {currentPlayer ? (
          <Box>
            <TextField id="game-id" label="Numéro de la partie" onChange={handleChangeGameId} />
            <Button
              onClick={() => {
                dispatch(joinGame({ gameId: gameId, playerId: currentPlayer._id }));
              }}
            >
              Rejoindre
            </Button>
          </Box>
        ) : (
          <CreatePlayerForm />
        )}
      </Box>
    </>
  );
}
