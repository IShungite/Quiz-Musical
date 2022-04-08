import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import CreatePlayerForm from "../../../../components/CreatePlayerForm/CreatePlayerForm";
import { useAppDispatch, useAppSelector } from "../../../../hooks/reducer";
import { joinGame, resetCreatePlayerStatus, WaitingAreaStatus } from "../../../../reducers/waitingAreaSlice";
import { RouteUrls } from "../../../../utility/config";

export default function Join() {
  const dispatch = useAppDispatch();

  const { currentPlayer, joinGameStatus } = useAppSelector((state) => state.waitingArea);

  const params = useParams();

  const router = useRouter();

  useEffect(() => {
    if (currentPlayer && params.id) {
      dispatch(joinGame({ gameId: params.id, playerId: currentPlayer._id }));
    }
  }, [currentPlayer, dispatch, params.id]);

  useEffect(() => {
    if (joinGameStatus === WaitingAreaStatus.Finished) {
      router.push(RouteUrls.WaitingArea);
    }
  }, [joinGameStatus, router]);

  useEffect(() => {
    return () => {
      dispatch(resetCreatePlayerStatus());
    };
  }, [dispatch]);

  return (
    <>
      <CreatePlayerForm />
    </>
  );
}
