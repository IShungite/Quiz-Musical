import { combineReducers } from "@reduxjs/toolkit";
import PlaylistSlice from "./PlaylistSlice";
import quizSlice from "./quizSlice";
import waitingAreaSlice from "./waitingAreaSlice";

const rootReducer = combineReducers({ playlist: PlaylistSlice, waitingArea: waitingAreaSlice, quiz: quizSlice });

export default rootReducer;
