import { configureStore } from '@reduxjs/toolkit';
import epochRewardsReducer from './features/epochRewardsSlice';

export const store = configureStore({
  reducer: {
    epochRewards: epochRewardsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

