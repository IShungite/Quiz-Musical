import { LoadingButton } from "@mui/lab";
import { Grid } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { FetchStatus } from "../../models/FetchStatus";
import { IGame } from "../../models/Game";
import { nextQuestion } from "../../reducers/quizSlice";
import CustomLoadingButton from "../CustomLoadingButton/CustomLoadingButton";
import GameTitle from "../GameTitle/GameTitle";
import PlayersScore from "../PlayersScore/PlayersScore";

export default function GameAnswer({ game, goodAnswer }: { game: IGame; goodAnswer: string }) {
  const dispatch = useAppDispatch();

  const { nextQuestionStatus, answerSelected, players, currentPlayer } = useAppSelector((state) => state.quiz);

  const isOwner = currentPlayer?._id === game.ownerId;

  return (
    <>
      <GameTitle game={game} />

      <Grid container justifyContent="space-evenly" spacing={4}>
        <Grid item textAlign="center">
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
                  <CustomLoadingButton variant={answerSelected === answer ? "contained" : "outlined"} disabled={true} disabledcolors={disabledColors}>
                    {answer}
                  </CustomLoadingButton>
                </Grid>
              );
            })}
          </Grid>
          {isOwner && (
            <LoadingButton
              loading={nextQuestionStatus === FetchStatus.Loading}
              variant="contained"
              onClick={() => {
                dispatch(nextQuestion(game._id));
              }}
              sx={{ mt: 2 }}
            >
              {game.currentTrackNb === game.maxTracks ? "Voir les résultats" : "Musique suivante"}
            </LoadingButton>
          )}
        </Grid>
        <Grid item>
          <PlayersScore game={game} players={players} />
        </Grid>
      </Grid>
    </>
  );
}
