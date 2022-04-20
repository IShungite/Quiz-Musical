import { LoadingButton } from "@mui/lab";
import { Box, Grid, styled } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { IGame } from "../../models/Game";
import { nextQuestion, WaitingAreaStatus } from "../../reducers/waitingAreaSlice";

interface CustomLoadingButtonProps {
  disabledColors: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

const CustomLoadingButton = styled(LoadingButton)<CustomLoadingButtonProps>(({ disabledColors }) => ({
  ":disabled": {
    borderColor: disabledColors.borderColor,
    color: disabledColors.textColor,
    backgroundColor: disabledColors.backgroundColor,
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
            const mainColor = goodAnswer === answer ? "green" : "red";
            const disabledColors =
              answer === answerSelected
                ? {
                    textColor: "white",
                    backgroundColor: mainColor,
                    borderColor: mainColor,
                  }
                : {
                    textColor: mainColor,
                    backgroundColor: "white",
                    borderColor: mainColor,
                  };

            return (
              <Grid item xs={12} sm={6} key={answer} textAlign="center">
                <CustomLoadingButton variant={answerSelected === answer ? "contained" : "outlined"} disabled={true} disabledColors={disabledColors}>
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
