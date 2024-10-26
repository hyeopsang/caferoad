import { createSlice } from '@reduxjs/toolkit';

const imgSlice = createSlice({
  name: 'imgs',
  initialState: {},
  reducers: {
    setImgs: (state, action) => {
      return action.payload;
    },
  },
});

export const { setImgs } = imgSlice.actions;
export default imgSlice.reducer;
