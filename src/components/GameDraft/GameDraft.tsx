import { LoadingButton } from "@mui/lab";
import { Box, Grid, Slider, Typography } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { FetchStatus } from "../../models/FetchStatus";
import { IGame, UpdateGameDto } from "../../models/Game";
import { startGame } from "../../reducers/quizSlice";

export default function GameDraft({ game }: { game: IGame }) {
  const dispatch = useAppDispatch();

  const { startGameStatus, players, currentPlayer } = useAppSelector((state) => state.quiz);

  const defaultNbSuggestions = 6;
  const defaultNbTracks = Math.min(10, game.totalPlaylistTracks ?? 10);

  const [maxSuggestions, setMaxSuggestions] = React.useState(defaultNbSuggestions);
  const [maxTracks, setMaxTracks] = React.useState(defaultNbTracks);

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

  const isOwner = currentPlayer?._id === game.ownerId;

  return (
    <>
      <Box textAlign="center">
        <Typography variant="h2">Salle d&apos;attente</Typography>
        <Typography variant="h6">Code de la partie: {game.joinCode}</Typography>
      </Box>

      <Typography variant="h4">Mode: {game.mode}</Typography>

      {isOwner && (
        <>
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
        </>
      )}

      <Typography variant="h4">Joueurs</Typography>
      <Grid container direction="column">
        {players.map((player) => (
          <Grid item xs={12} sm={6} md={4} key={player._id}>
            - {player.name}
          </Grid>
        ))}
      </Grid>

      {isOwner && (
        <Box textAlign="center">
          <LoadingButton loading={startGameStatus === FetchStatus.Loading} variant="outlined" onClick={onClickPlay}>
            Jouer
          </LoadingButton>
        </Box>
      )}
    </>
  );
}
