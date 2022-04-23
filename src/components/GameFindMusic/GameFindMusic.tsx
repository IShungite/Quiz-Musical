import { LoadingButton } from "@mui/lab";
import { Grid } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import useAudio from "../../hooks/useAudio";
import { CreateAnswerDto } from "../../models/Answer";
import { FetchStatus } from "../../models/FetchStatus";
import { IGame } from "../../models/Game";
import { sendAnswer, setAnswerSelected } from "../../reducers/waitingAreaSlice";
import GameTitle from "../GameTitle/GameTitle";
import PlayersScore from "../PlayersScore/PlayersScore";

export default function GameFindMusic({ game }: { game: IGame }) {
  const dispatch = useAppDispatch();

  useAudio(game.currentTrackPreview);

  const { currentPlayer, sendAnswerStatus, answerSelected, players } = useAppSelector((state) => state.waitingArea);

  const onClickSendAnswer = (answer: string) => {
    if (!currentPlayer) return;

    const createAnswerDto: CreateAnswerDto = { answer, playerId: currentPlayer._id };
    dispatch(sendAnswer({ gameId: game._id, createAnswerDto }));
    dispatch(setAnswerSelected(answer));
  };

  return (
    <>
      <GameTitle game={game} />

      <Grid container justifyContent="space-evenly" spacing={4}>
        <Grid item>
          <Grid container alignItems="center" justifyContent="center" spacing={2}>
            {game.currentAnswerSuggestions.map((answer) => (
              <Grid item xs={12} sm={6} key={answer} textAlign="center">
                <LoadingButton
                  loading={sendAnswerStatus === FetchStatus.Loading}
                  variant="outlined"
                  onClick={() => {
                    onClickSendAnswer(answer);
                  }}
                  color={answerSelected === answer ? "secondary" : "primary"}
                >
                  {answer}
                </LoadingButton>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <PlayersScore game={game} players={players} />
        </Grid>
      </Grid>
    </>
  );
}
