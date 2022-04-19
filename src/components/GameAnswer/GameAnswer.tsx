import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, styled, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { IGame } from "../../models/Game";
import { nextQuestion, WaitingAreaStatus } from "../../reducers/waitingAreaSlice";
import { tryFetch } from "../../utility/utility";

interface CustomLoadingButtonProps {
  disabledColor?: string;
}

const CustomLoadingButton = styled(LoadingButton)<CustomLoadingButtonProps>(({ disabledColor }) => ({
  ":disabled": {
    borderColor: disabledColor,
    color: disabledColor,
  },
}));

export default function GameAnswer({ game, answerSelected }: { game: IGame; answerSelected: string }) {
  const dispatch = useAppDispatch();

  const { goodAnswer, nextQuestionStatus } = useAppSelector((state) => state.waitingArea);

  return (
    <>
      <Box textAlign="center">
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          {game.currentAnswerSuggestions.map((answer) => {
            const color = goodAnswer === answer ? "green" : "red";
            return (
              <Grid item xs={12} sm={6} key={answer} textAlign="center">
                <CustomLoadingButton variant="outlined" disabled={true} disabledColor={color}>
                  {answer}
                </CustomLoadingButton>
              </Grid>
            );
          })}
        </Grid>
        <LoadingButton
          loading={nextQuestionStatus === WaitingAreaStatus.Loading}
          variant="contained"
          onClick={() => {
            dispatch(nextQuestion(game._id));
          }}
          sx={{ mt: 2 }}
        >
          {game.currentTrackNb === game.maxTracks ? "Voir les résultats" : "Musique suivante"}
        </LoadingButton>
      </Box>
    </>
  );
}
