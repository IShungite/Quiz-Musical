import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { FetchStatus } from "../../models/FetchStatus";
import CreatePlayerForm from "../CreatePlayerForm/CreatePlayerForm";

export default function CreatePlayerDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { createPlayerStatus, currentPlayer } = useAppSelector((state) => state.quiz);

  useEffect(() => {
    if (createPlayerStatus === FetchStatus.Finished && currentPlayer) {
      setOpen(false);
    }
  }, [createPlayerStatus, currentPlayer, setOpen]);

  return (
    <Dialog open={open}>
      <DialogTitle>Nouveau joueur</DialogTitle>
      <DialogContent>
        <CreatePlayerForm />
      </DialogContent>
    </Dialog>
  );
}
