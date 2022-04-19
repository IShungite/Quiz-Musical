import { LoadingButton } from "@mui/lab";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { IGame } from "../../models/Game";
import { IPlayer } from "../../models/Player";
import { nextQuestion, WaitingAreaStatus } from "../../reducers/waitingAreaSlice";

export default function GameAnswer({ game }: { game: IGame }) {
  const dispatch = useAppDispatch();

  const { goodAnswer, nextQuestionStatus } = useAppSelector((state) => state.waitingArea);

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h2">
          La réponse est <span style={{ fontStyle: "italic" }}>{goodAnswer}</span>
        </Typography>
        <LoadingButton
          loading={nextQuestionStatus === WaitingAreaStatus.Loading}
          variant="contained"
          onClick={() => {
            dispatch(nextQuestion(game._id));
          }}
        >
          Next question
        </LoadingButton>
      </Box>
    </>
  );
}
