import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";
import { IGame } from "../../models/Game";
import { IPlayer } from "../../models/Player";

export default function PlayersScore({ game, players }: { game: IGame; players: IPlayer[] }) {
  return (
    <Grid item>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Rang</TableCell>
              <TableCell align="left">Nom</TableCell>
              <TableCell align="left">Score / {game.maxTracks}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player, i) => (
              <TableRow key={player._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="left">{i + 1}</TableCell>
                <TableCell align="left">{player.name}</TableCell>
                <TableCell align="left">{player.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
