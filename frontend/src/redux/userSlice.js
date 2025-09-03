import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  name: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { userId, name, email } = action.payload;
      state.userId = userId;
      state.name = name;
      state.email = email;
    },
    clearUser: (state) => {
      state.userId = null;
      state.name = "";
      state.email = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
