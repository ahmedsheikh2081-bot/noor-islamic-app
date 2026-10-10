import { configureStore } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
} from "redux-persist";

import rootReducer from "./rootReducer";

// Browser localStorage adapter
const storage = {
    getItem: (key) => {
        return Promise.resolve(localStorage.getItem(key));
    },

    setItem: (key, value) => {
        localStorage.setItem(key, value);
        return Promise.resolve();
    },

    removeItem: (key) => {
        localStorage.removeItem(key);
        return Promise.resolve();
    },
};

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(
    persistConfig,
    rootReducer
);

export const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);