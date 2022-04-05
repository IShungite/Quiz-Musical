import React, { useEffect, useState } from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { Playlist } from "../../models/Playlist";
import { useRouter } from "next/router";
import { RouteUrls } from "../../utility/config";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { clearState, createGame, WaitingAreaStatus } from "../../reducers/waitingAreaSlice";
import { CreateGameDto, GameMode } from "../../models/Game";
import CreatePlayerDialog from "../CreatePlayerDialog/CreatePlayerDialog";

type Props = {
  playlist: Playlist;
};

export default function MusicCard({ playlist }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { status, currentPlayer } = useAppSelector((state) => state.waitingArea);

  const [dialogOpen, setDialogOpen] = useState(false);

  const onClick = () => {
    if (!currentPlayer) {
      setDialogOpen(true);
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
    if (status === WaitingAreaStatus.Finished) router.push(RouteUrls.WaitingArea);
  }, [router, status]);

  useEffect(() => {
    return () => {
      dispatch(clearState());
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
      <CreatePlayerDialog open={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
}
