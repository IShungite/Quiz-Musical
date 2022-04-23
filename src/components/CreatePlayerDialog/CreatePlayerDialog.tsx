import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { FetchStatus } from "../../models/FetchStatus";
import { resetCreatePlayerStatus } from "../../reducers/waitingAreaSlice";
import CreatePlayerForm from "../CreatePlayerForm/CreatePlayerForm";

export default function CreatePlayerDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const dispatch = useAppDispatch();

  const { createPlayerStatus, currentPlayer } = useAppSelector((state) => state.waitingArea);

  useEffect(() => {
    if (createPlayerStatus === FetchStatus.Finished && currentPlayer) {
      setOpen(false);
    }
  }, [createPlayerStatus, currentPlayer, setOpen]);

  // Reset createPlayerStatus when component is unmounted
  useEffect(() => {
    return () => {
      dispatch(resetCreatePlayerStatus());
    };
  }, [dispatch]);

  return (
    <Dialog open={open}>
      <DialogTitle>Nouveau joueur</DialogTitle>
      <DialogContent>
        <CreatePlayerForm />
      </DialogContent>
    </Dialog>
  );
}
