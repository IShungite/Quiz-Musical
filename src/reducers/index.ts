import { combineReducers } from "@reduxjs/toolkit";
import PlaylistSlice from "./PlaylistSlice";
import waitingAreaSlice from "./waitingAreaSlice";

const rootReducer = combineReducers({ playlist: PlaylistSlice, waitingArea: waitingAreaSlice });

export default rootReducer;
