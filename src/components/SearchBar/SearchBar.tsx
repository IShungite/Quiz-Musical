import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase } from "@mui/material";
import useSpotify from "../../hooks/useSpotify";
import { useDebouncedCallback } from "use-debounce";
import { Playlist } from "../../models/Playlist";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function SearchBar() {
  const spotifyApi = useSpotify();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const debounced = useDebouncedCallback((value) => {
    if (value) {
      fetchPlaylists(value);
    } else {
      setPlaylists([]);
    }
  }, 1000);

  const fetchPlaylists = async (searchTerm: string) => {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=playlist&limit=10`, {
      headers: {
        Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
      },
    }).then((res) => res.json());
    setPlaylists(response.playlists.items);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounced(event.target.value);
  };

  return (
    <>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase onChange={handleChange} placeholder="Search…" inputProps={{ "aria-label": "search" }} />
      </Search>
      {playlists.map((playlist) => (
        <div key={playlist.id}>{playlist.name}</div>
      ))}
    </>
  );
}
