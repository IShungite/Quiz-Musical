import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reducer";
import { clearState, createPlayer, WaitingAreaStatus } from "../../reducers/waitingAreaSlice";
import CreatePlayerForm from "../CreatePlayerForm/CreatePlayerForm";

export default function CreatePlayerDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const dispatch = useAppDispatch();

  const { createPlayerStatus, currentPlayer } = useAppSelector((state) => state.waitingArea);

  const onClickCreate = (name: string) => {
    dispatch(createPlayer({ name }));
  };

  useEffect(() => {
    if (createPlayerStatus === WaitingAreaStatus.Finished && currentPlayer) {
      setOpen(false);
    }
  }, [createPlayerStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  return (
    <Dialog open={open}>
      <DialogTitle>New player</DialogTitle>
      <DialogContent>
        <CreatePlayerForm onClickCreate={onClickCreate} />
      </DialogContent>
    </Dialog>
  );
}
