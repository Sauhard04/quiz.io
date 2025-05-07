import React from 'react';
import { Card, CardContent, CardActions, Typography } from '@mui/material';
import AppButton from './AppButton';
import { Link } from 'react-router-dom';

const AIQuizCard: React.FC = () => {
  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        margin: 2,
        boxShadow: 3,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)'
        }
      }}
      className="quiz-card"
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Typography 
          gutterBottom 
          variant="h5" 
          component="div"
          sx={{ fontWeight: 'bold' }}
        >
          AI Quiz Generator
        </Typography>
        <Typography 
          variant="body2" 
          color="inherit"
          sx={{ mb: 1 }}
        >
          <span role="img" aria-label="robot">🤖</span> Generate quizzes with Gemini AI
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Link 
          to="/quiz/ai" 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <AppButton 
            size="small" 
            variant="contained" 
          >
            Start AI Quiz
          </AppButton>
        </Link>
      </CardActions>
    </Card>
  );
};

export default AIQuizCard;
