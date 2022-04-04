import { combineReducers } from "@reduxjs/toolkit";
import PlaylistSlice from "./PlaylistSlice";
import TrackSlice from "./TrackSlice";

const rootReducer = combineReducers({ playlist: PlaylistSlice, track: TrackSlice });

export default rootReducer;
