import { Box, Button, Grid, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Timer from "../../../components/Timer/timer";
import { useAppDispatch, useAppSelector } from "../../../hooks/reducer";
import { IGame } from "../../../models/Game";
import { nextQuestion, sendAnswer } from "../../../reducers/waitingAreaSlice";
import { RouteUrls } from "../../../utility/config";

export default function Quiz({ game }: { game: IGame }) {
  const dispatch = useAppDispatch();

  const [audioIsPlaying, setAudioIsPlaying] = useState(false);

  const date = new Date();
  date.setSeconds(date.getSeconds() + 20);

  useEffect(() => {
    if (game.currentTrackPreview && !audioIsPlaying) {
      const audio = new Audio(game.currentTrackPreview);
      audio.play();
      setAudioIsPlaying(true);
    }
  }, [game.currentTrackPreview]);

  const onClick = (answer: string) => {
    dispatch(sendAnswer({ gameId: game._id, answer }));
  };

  return (
    <>
      <Box textAlign="center" sx={{ mb: 5 }}>
        <Typography variant="h2">Quel est le nom de l&apos;artiste ?</Typography>
      </Box>

      <Grid container alignItems="center" justifyContent="center" spacing={2}>
        {game?.currentAnswerSuggestions.map((answer) => (
          <Grid item xs={12} sm={6} key={answer} textAlign="center">
            <Button
              variant="outlined"
              onClick={() => {
                onClick(answer);
              }}
            >
              {answer}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const response = await fetch(`http://localhost:3000/api/game/${id}`);
  const game: IGame = (await response.json()).data;

  if (!game) {
    context.res.writeHead(400, { Location: RouteUrls.NewQuiz });
    context.res.end();

    return { props: {} };
  }

  return {
    props: {
      game,
    },
  };
};
