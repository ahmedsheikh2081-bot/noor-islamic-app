
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bookmarks: [],
};

const bookmarkSlice = createSlice({
    name: "bookmark",

    initialState,

    reducers: {

        // ================= ADD BOOKMARK =================
        addBookmark: (state, action) => {
            const bookmark = action.payload;

            // bookmarkId zaroor hona chahiye
            if (!bookmark?.bookmarkId) {
                return;
            }

            const alreadyExists = state.bookmarks.some(
                (item) =>
                    item.bookmarkId === bookmark.bookmarkId
            );

            // Duplicate bookmark allow nahi hoga
            if (!alreadyExists) {
                state.bookmarks.push(bookmark);
            }
        },


        // ================= REMOVE BOOKMARK =================
        removeBookmark: (state, action) => {
            const bookmarkId =
                typeof action.payload === "string"
                    ? action.payload
                    : action.payload?.bookmarkId;

            if (!bookmarkId) {
                return;
            }

            state.bookmarks = state.bookmarks.filter(
                (item) =>
                    item.bookmarkId !== bookmarkId
            );
        },


        // ================= CLEAR ALL =================
        clearBookmarks: (state) => {
            state.bookmarks = [];
        },
    },
});

export const {
    addBookmark,
    removeBookmark,
    clearBookmarks,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
