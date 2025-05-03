import React from 'react';
import { Container, ThemeProvider, createTheme, useMediaQuery, CssBaseline } from '@mui/material'
import Grid from '@mui/material/Grid';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import QuizCard from './components/QuizCard'
import QuizPage from './components/QuizPage'
import LandingPage from './components/LandingPage'
import { quizData } from './data/quizData';
import './App.css'

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#2196F3',
            dark: '#1976D2',
          },
          secondary: {
            main: '#FF4081',
          },
          background: {
            default: prefersDarkMode ? '#121212' : '#f5f5f5',
            paper: prefersDarkMode ? '#1E1E1E' : '#ffffff',
          },
          success: {
            main: '#4CAF50',
          },
          error: {
            main: '#F44336',
          },
          text: {
            primary: prefersDarkMode ? '#ffffff' : '#333333',
            secondary: prefersDarkMode ? '#9e9e9e' : '#666666',
          },
        },
        typography: {
          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
          h1: {
            fontWeight: 600,
          },
          h2: {
            fontWeight: 500,
          },
          h3: {
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quizzes" element={
            <Container maxWidth="lg" sx={{ mt: 4, px: 2 }}>
              <Grid container spacing={3}>
                {quizData.map((quiz) => (
                  <Grid item key={quiz.id} xs={12} sm={6} md={4} sx={{ width: '100%' }}>
                    <QuizCard quiz={quiz} />
                  </Grid>
                ))}
              </Grid>
            </Container>
          } />
          <Route path="/quiz/:id" element={<QuizPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
