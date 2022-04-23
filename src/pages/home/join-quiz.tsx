import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CreatePlayerForm from "../../components/CreatePlayerForm/CreatePlayerForm";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { FetchStatus } from "../../models/FetchStatus";
import { joinGame, resetCreatePlayerStatus, resetJoinGameStatus } from "../../reducers/quizSlice";
import { RouteUrls } from "../../utility/config";

export default function JoinQuiz() {
  const dispatch = useAppDispatch();

  const { currentPlayer, joinGameStatus } = useAppSelector((state) => state.quiz);

  const [gameId, setGameId] = useState("");

  const router = useRouter();

  const handleChangeGameId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameId(event.target.value);
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

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h2">Rejoindre une partie</Typography>
      </Box>
      <Box>
        {currentPlayer ? (
          <Box>
            <TextField id="game-id" label="Numéro de la partie" onChange={handleChangeGameId} />
            <LoadingButton
              onClick={() => {
                dispatch(joinGame({ gameId: gameId, playerId: currentPlayer._id }));
              }}
              loading={joinGameStatus === FetchStatus.Loading}
            >
              Rejoindre
            </LoadingButton>
          </Box>
        ) : (
          <CreatePlayerForm />
        )}
      </Box>
    </>
  );
}
