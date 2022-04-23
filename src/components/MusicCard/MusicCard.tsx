import React, { useEffect } from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { Playlist } from "../../models/Playlist";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { createGame, resetCreateGameStatus } from "../../reducers/waitingAreaSlice";
import { CreateGameDto, GameMode } from "../../models/Game";
import { RouteUrls } from "../../utility/config";
import { FetchStatus } from "../../models/FetchStatus";

type Props = {
  playlist: Playlist;
};

export default function MusicCard({ playlist }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { createGameStatus, currentPlayer } = useAppSelector((state) => state.waitingArea);

  const onClick = () => {
    if (!currentPlayer) {
      return;
    }
    const createGameDto: CreateGameDto = {
      ownerId: currentPlayer._id,
      playlistId: playlist.id,
      mode: GameMode.FindTheArtist,
    };
    dispatch(createGame(createGameDto));
  };

  useEffect(() => {
    if (createGameStatus === FetchStatus.Finished) router.push(RouteUrls.Quiz);
  }, [router, createGameStatus]);

  // Reset createGameStatus when component is unmounted
  useEffect(() => {
    return () => {
      dispatch(resetCreateGameStatus());
    };
  }, [dispatch]);

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea onClick={onClick}>
          <CardMedia component="img" height="200" image={playlist.picture} alt="green iguana" />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {playlist.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {playlist.user.name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
