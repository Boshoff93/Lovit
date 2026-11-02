import { createTheme, Theme } from '@mui/material/styles';

export function createWorkspaceTheme(base: Theme): Theme {
  const paper = { backgroundColor: '#171e28 !important', backgroundImage: 'none !important', boxShadow: 'none' };
  return createTheme(base, {
    palette: {
      primary: { main: '#007AFF', contrastText: '#ffffff' },
      text: { primary: '#f4f7fb', secondary: '#aab4c2', disabled: '#99a6b6' },
      background: { default: '#0d1118', paper: '#171e28' },
    },
    components: {
      MuiPaper: { styleOverrides: { root: paper } },
      MuiCard: { styleOverrides: { root: paper } },
      MuiDrawer: { styleOverrides: { paper: { ...paper, backgroundColor: '#111720 !important' } } },
      MuiMenu: { styleOverrides: { paper } },
      MuiDialog: { styleOverrides: { paper } },
      MuiChip: { styleOverrides: { root: { borderRadius: 8, fontWeight: 500 } } },
      MuiInputLabel: { styleOverrides: { root: { color: '#aab4c2' } } },
      MuiButton: { styleOverrides: { root: {
        textTransform: 'none', boxShadow: 'none',
        '&.MuiButton-contained': {
          boxShadow: 'none',
          '&.MuiButton-containedPrimary': {
            background: '#007AFF', color: '#ffffff',
            '&:hover': { background: '#0056CC', boxShadow: 'none' },
            '&:active': { background: '#004da8' },
          },
        },
        '&.MuiButton-text': { color: '#80baff', '&:hover': { background: '#007aff12' } },
        '&.MuiButton-outlinedPrimary': { color: '#80baff', borderColor: '#007aff70' },
      } } },
    },
  });
}
