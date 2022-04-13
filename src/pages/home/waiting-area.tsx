import { Box, Button, Grid, Slider, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { UpdateGameDto } from "../../models/Game";
import { resetStartGameStatus, startGame, WaitingAreaStatus } from "../../reducers/waitingAreaSlice";
import { RouteUrls } from "../../utility/config";

export default function WaitingArea() {
  const { game, startGameStatus } = useAppSelector((state) => state.waitingArea);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const defaultNbSuggestions = 6;
  const defaultNbTracks = Math.min(10, game.totalPlaylistTracks ?? 10);

  const [maxSuggestions, setMaxSuggestions] = React.useState(defaultNbSuggestions);
  const [maxTracks, setMaxTracks] = React.useState(defaultNbTracks);

  useEffect(() => {
    if (startGameStatus === WaitingAreaStatus.Finished && game) {
      dispatch(resetStartGameStatus());
      router.push(`${RouteUrls.Quiz}/${game._id}`);
    }
  }, [dispatch, game, router, startGameStatus]);

  if (!game) {
    router.push(RouteUrls.NewQuiz);
    return null;
  }

  const onClickPlay = () => {
    const updateGameDto: UpdateGameDto = {
      maxSuggestions,
      maxTracks,
    };
    dispatch(startGame({ gameId: game._id, updateGameDto }));
  };

  const handleNbSuggestionsChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setMaxSuggestions(newValue);
    }
  };

  const handleNbTracksChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setMaxTracks(newValue);
    }
  };

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h2">Salle d&apos;attente</Typography>
      </Box>

      <Typography variant="h4">Mode: {game.mode}</Typography>
      <Typography variant="h4">Options</Typography>
      <Typography variant="h5">Nombre de suggestions: {maxSuggestions} </Typography>
      <Slider
        sx={{ maxWidth: 350 }}
        aria-label="Nombre de suggestions"
        defaultValue={defaultNbSuggestions}
        step={1}
        marks
        min={2}
        max={8}
        onChange={handleNbSuggestionsChange}
      />
      <Typography variant="h5">Nombre de musiques: {maxTracks} </Typography>
      <Slider
        sx={{ maxWidth: 350 }}
        aria-label="Nombre de musiques"
        defaultValue={defaultNbTracks}
        step={1}
        marks
        min={3}
        max={game.totalPlaylistTracks}
        onChange={handleNbTracksChange}
      />

      <Typography variant="h4">Joueurs</Typography>
      <Grid container>
        {game.playersId.map((playerId) => (
          <Grid item xs={12} sm={6} md={4} key={playerId}>
            - {playerId}
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center">
        <Button variant="outlined" onClick={onClickPlay}>
          Jouer
        </Button>
      </Box>
    </>
  );
}
