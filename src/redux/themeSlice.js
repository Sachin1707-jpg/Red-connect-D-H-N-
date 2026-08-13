import { createSlice } from '@reduxjs/toolkit';

const initialDarkMode = localStorage.getItem('redconnect_theme') === 'dark';
if (initialDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: initialDarkMode,
    // On mobile (< 1024px) start collapsed so sidebar doesn't cover content
    sidebarCollapsed: window.innerWidth < 1024,
    commandPaletteOpen: false,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('redconnect_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('redconnect_theme', 'light');
      }
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setCommandPaletteOpen: (state, action) => {
      state.commandPaletteOpen = action.payload;
    }
  },
});

export const { toggleDarkMode, toggleSidebar, setCommandPaletteOpen } = themeSlice.actions;
export default themeSlice.reducer;
