import { Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreatePlayerForm from "../../../../components/CreatePlayerForm/CreatePlayerForm";
import { useAppDispatch, useAppSelector } from "../../../../hooks/reducer";
import { clearState, createPlayer, joinGame, WaitingAreaStatus } from "../../../../reducers/waitingAreaSlice";
import { RouteUrls } from "../../../../utility/config";

export default function Join() {
  const dispatch = useAppDispatch();

  const { createPlayerStatus, currentPlayer, joinGameStatus } = useAppSelector((state) => state.waitingArea);

  const params = useParams();

  const router = useRouter();

  const [name, setName] = useState("");

  const onClickJoin = () => {
    dispatch(createPlayer({ name }));
  };

  useEffect(() => {
    if (createPlayerStatus === WaitingAreaStatus.Finished && currentPlayer && params.id) {
      dispatch(joinGame({ gameId: params.id, playerId: currentPlayer._id }));
    }
  }, [createPlayerStatus]);

  useEffect(() => {
    if (joinGameStatus === WaitingAreaStatus.Finished) {
      router.push(RouteUrls.WaitingArea);
    }
  }, [joinGameStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  return (
    <>
      <CreatePlayerForm onClickCreate={onClickJoin} />
    </>
  );
}
