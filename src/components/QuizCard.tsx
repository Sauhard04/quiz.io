import React from 'react';
import { Quiz } from '../../types/types';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        margin: 2,
        boxShadow: 3,
        transition: 'transform 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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
          {quiz.title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          <span>🎯</span>
          {quiz.questions.length} questions
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Link 
          to={`/quiz/${quiz.id}`} 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Button 
            size="small" 
            variant="contained" 
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Start Quiz
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default QuizCard;
