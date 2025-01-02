import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EpochRewardsState {
  currentEpoch: string; // Tracks the current epoch
  userRewards: number | null; // Add other properties as needed
}

const initialState: EpochRewardsState = {
  currentEpoch: "",
  userRewards: null,
};

const epochRewardsSlice = createSlice({
  name: 'epochRewards',
  initialState,
  reducers: {
    setCurrentEpoch: (state, action: PayloadAction<string>) => {
      state.currentEpoch = action.payload;
    },
    setUserRewards: (state, action: PayloadAction<number | null>) => {
      state.userRewards = action.payload;
    },
  },
});

export const { setCurrentEpoch, setUserRewards } = epochRewardsSlice.actions;

export default epochRewardsSlice.reducer;

