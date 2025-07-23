import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'dark',
  modalOpen: false,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
    openModal(state) {
      state.modalOpen = true;
    },
    closeModal(state) {
      state.modalOpen = false;
    },
    setNotification(state, action) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = null;
    },
  },
});

export const { setTheme, openModal, closeModal, setNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;