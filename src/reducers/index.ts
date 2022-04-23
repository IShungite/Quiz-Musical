import { combineReducers } from "@reduxjs/toolkit";
import playlistSlice from "./playlistSlice";
import quizSlice from "./quizSlice";

const rootReducer = combineReducers({ playlist: playlistSlice, quiz: quizSlice });

export default rootReducer;
