import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { quizData } from '../data/quizData';
import { Quiz } from '../types/types';
import ScoreDisplay from './ScoreDisplay';
//import { PieChart, Pie, Cell } from 'recharts';

const TIMER_START = 15; // seconds per question

const QuizPage: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const quiz: Quiz | undefined = quizData.find((q) => q.id === id);
  if (!quiz) {
    return <Container><Paper sx={{ p: 4, mt: 8, textAlign: 'center' }}><Typography variant="h4">Quiz not found</Typography></Paper></Container>;
  }
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(TIMER_START);
  const navigate = useNavigate();

  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (!quiz) {
      navigate('/');
      return;
    }

    if (currentQuestion >= quiz.questions.length) {
      setQuizCompleted(true);
    }
  }, [currentQuestion, quiz, navigate]);

  // Timer effect
  useEffect(() => {
    if (showResults || showAnswer) return; // Don't run timer on results or after answer
    setTimer(TIMER_START); // Reset timer on question change
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          handleAnswerTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [currentQuestion, showResults, showAnswer]);

  // Handle when timer runs out
  // (no changes needed here, just keeping for context)
  const handleAnswerTimeout = () => {
    if (!showResults) {
      setShowAnswer(true);
      setTimeout(() => {
        if (currentQuestion < quiz!.questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
        } else {
          setShowResults(true);
        }
      }, 1500);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setShowAnswer(true);

    if (answerIndex === quiz.questions[currentQuestion].correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    }
    // Do NOT auto-advance here; wait for user to click Next or timer to hit 0
  };

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  if (showResults) {
    const data = [
      { name: 'Correct', value: correctAnswers },
      { name: 'Incorrect', value: quiz.questions.length - correctAnswers },
    ];

    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <ScoreDisplay correctAnswers={correctAnswers} totalQuestions={quiz.questions.length} />
        <Box sx={{ width: '100%', maxWidth: 600, mt: 4 }}>
          
        </Box>
      </Container>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {quiz.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Question {currentQuestion + 1} of {quiz.questions.length}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {currentQuestionData.text}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color={timer <= 5 ? 'error' : 'text.primary'}>
              Time Left: {timer}s
            </Typography>
          </Box>
          {currentQuestionData.options.map((option: string, index: number) => {
  // Determine the color and shadow for each option after answer is shown
  let bgColor = '#111';
  let textColor = '#fff';
  let boxShadow = 'none';
  if (showAnswer) {
    const green = theme.palette.success.main;
    const red = theme.palette.error.main;
    if (selectedAnswer === currentQuestionData.correctAnswer && index === selectedAnswer) {
      // Selected correct answer
      bgColor = green;
      textColor = '#fff';
      boxShadow = `0 0 16px 2px ${green}, 0 0 32px 8px ${green}`;
    } else if (selectedAnswer !== currentQuestionData.correctAnswer) {
      if (index === selectedAnswer) {
        // Selected wrong answer
        bgColor = red;
        textColor = '#fff';
        boxShadow = `0 0 16px 2px ${red}, 0 0 32px 8px ${red}`;
      } else if (index === currentQuestionData.correctAnswer) {
        // The correct answer (not selected)
        bgColor = green;
        textColor = '#fff';
        boxShadow = `0 0 16px 2px ${green}, 0 0 32px 8px ${green}`;
      }
    }
  }
  // All other options remain dark with no shadow or color

  let emoji = null;
  if (showAnswer) {
    if (index === currentQuestionData.correctAnswer) {
      emoji = <span style={{ marginLeft: 12, fontSize: '1.3em' }}>✅</span>;
    } else if (index === selectedAnswer && selectedAnswer !== currentQuestionData.correctAnswer) {
      emoji = <span style={{ marginLeft: 12, fontSize: '1.3em' }}>❌</span>;
    }
  }
  return (
    <Button
      key={index}
      fullWidth
      variant="contained"
      color={selectedAnswer === index ? 'primary' : 'inherit'}
      onClick={() => handleAnswerSelect(index)}
      disabled={showAnswer || timer === 0}
      sx={{
        backgroundColor: bgColor,
        color: textColor,
        boxShadow,
        mb: 1,
        py: 1.5,
        fontSize: '1rem',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: showAnswer ? bgColor : selectedAnswer === index ? 'primary.dark' : 'primary.light',
          boxShadow,
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span>{option}</span>
      {emoji}
    </Button>
  );
})}
          <Box sx={{ mt: 4, width: '100%' }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                if (selectedAnswer !== null) {
                  if (currentQuestion < quiz.questions.length - 1) {
                    setCurrentQuestion((prev) => prev + 1);
                    setSelectedAnswer(null);
                    setShowAnswer(false);
                  } else {
                    setShowResults(true);
                  }
                }
              }}
              disabled={selectedAnswer === null}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              {currentQuestion < quiz.questions.length - 1
                ? 'Next Question'
                : 'Finish Quiz'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default QuizPage;
