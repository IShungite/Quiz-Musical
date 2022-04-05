import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import Timer from "../../components/Timer/timer";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { nextQuestion } from "../../reducers/waitingAreaSlice";
import { RouteUrls } from "../../utility/config";

export default function Quiz() {
  const { game } = useAppSelector((state) => state.waitingArea);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const date = new Date();
  date.setSeconds(date.getSeconds() + 5);

  const onTimerExpires = useCallback(() => {
    if (!game) {
      router.push(RouteUrls.NewQuiz);
      return;
    }

    console.log("onTimerExpires");

    dispatch(nextQuestion(game._id));
  }, []);

  console.log("Quiz");

  if (!game) {
    router.push(RouteUrls.NewQuiz);
    return;
  }

  if (game.currentAnswerSuggestions.length === 0) {
    return <Typography>LOADING</Typography>;
  }

  return (
    <>
      <Box textAlign="center" sx={{ mb: 5 }}>
        <Typography variant="h2">Quel est le nom de l&apos;artiste ?</Typography>
        <Timer onExpire={onTimerExpires} expiryTimestamp={date} />
      </Box>

      <Grid container alignItems="center" justifyContent="center" spacing={2}>
        {game?.currentAnswerSuggestions.map((answer) => (
          <Grid item xs={12} sm={6} key={answer} textAlign="center">
            <Button variant="outlined">{answer}</Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
