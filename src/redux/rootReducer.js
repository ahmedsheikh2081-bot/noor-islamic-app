import { combineReducers } from "@reduxjs/toolkit";
import bookmarkReducer from "./bookmarkSlice";

const rootReducer = combineReducers({
    bookmark: bookmarkReducer,
});

export default rootReducer;