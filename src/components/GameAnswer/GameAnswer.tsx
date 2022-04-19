import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { IGame } from "../../models/Game";
import { IPlayer } from "../../models/Player";
import { nextQuestion } from "../../reducers/waitingAreaSlice";

export default function GameAnswer({ game }: { game: IGame }) {
  const dispatch = useAppDispatch();

  const { goodAnswer } = useAppSelector((state) => state.waitingArea);

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h2">
          The answer is <span style={{ fontStyle: "italic" }}>{goodAnswer}</span>
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            dispatch(nextQuestion(game._id));
          }}
        >
          Next question
        </Button>
      </Box>
    </>
  );
}
