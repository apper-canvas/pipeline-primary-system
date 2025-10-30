import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  userId: null,
  isAuthenticated: false,
  isInitialized: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
setUser: (state, action) => {
      state.user = JSON.parse(JSON.stringify(action.payload));
      state.userId = action.payload?.userId || null;
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.userId = null;
      state.isAuthenticated = false;
      state.isInitialized = false;
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
  },
});

export const { setUser, clearUser, setInitialized } = userSlice.actions;
export default userSlice.reducer;