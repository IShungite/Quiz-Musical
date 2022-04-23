import React from "react";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase } from "@mui/material";
import { useDebouncedCallback } from "use-debounce";
import { useAppDispatch } from "../../hooks/reducer";
import { clearPlaylists, getPlaylists } from "../../reducers/playlistSlice";

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
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function SearchBar() {
  const dispatch = useAppDispatch();

  const debounced = useDebouncedCallback(async (value: string) => {
    if (value) {
      dispatch(getPlaylists(value));
    } else {
      dispatch(clearPlaylists());
    }
  }, 700);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounced(event.target.value);
  };

  return (
    <Search sx={{ mb: 2 }}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase onChange={handleChange} placeholder="Search…" inputProps={{ "aria-label": "search" }} fullWidth />
    </Search>
  );
}
