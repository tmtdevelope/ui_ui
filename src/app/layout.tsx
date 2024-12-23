"use client"
// src/app/layout.tsx (if using Next.js 13 with app directory)
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from '@mui/material';
//import { theme } from '../theme'; // Your MUI theme if you have one
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0052cc',
    },
    secondary: {
      main: '#edf2ff',
    },
  },
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <html >
          <body style={{ margin: 0 }}>
            {children}
          </body>
        </html>
      </ThemeProvider>
    </AuthProvider>
  );
}
