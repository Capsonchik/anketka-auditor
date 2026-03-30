import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { api } from "@shared/api/api"
import { userReducer } from "@entities/user"

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  user: userReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
