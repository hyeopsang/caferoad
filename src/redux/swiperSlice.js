import { createSlice } from '@reduxjs/toolkit';

const swiperSlice = createSlice({
  name: 'swiper',
  initialState: [],
  reducers: {
    setSwiper: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSwiper } = swiperSlice.actions;
export default swiperSlice.reducer;
