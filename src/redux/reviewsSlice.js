import { createSlice } from '@reduxjs/toolkit';

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: [],
  reducers: {
    setReviews: (state, action) => {
      return action.payload;
    },
  },
});

export const { setReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
