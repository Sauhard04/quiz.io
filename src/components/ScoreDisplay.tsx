import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Box, Paper, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ScoreDisplayProps {
  correctAnswers: number;
  totalQuestions: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ correctAnswers, totalQuestions }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChart(true);
      const interval = setInterval(() => {
        if (score < correctAnswers) {
          setScore((prev) => Math.min(prev + 1, correctAnswers));
          setPercentage((prev) => Math.min(prev + (100 / totalQuestions), (correctAnswers / totalQuestions) * 100));
        } else {
          clearInterval(interval);
        }
      }, 100);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [correctAnswers, totalQuestions]);

  const chartData = {
    labels: ['Correct Answers', 'Total Questions'],
    datasets: [
      {
        data: [correctAnswers, totalQuestions - correctAnswers],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.error.main,
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart' as const,
    },
    layout: {
      padding: 20,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #00C853 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Quiz Results
        </Typography>

        <Box sx={{ mb: 4 }}>
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={100}
            thickness={3}
            sx={{
              color: theme.palette.success.main,
              mx: 'auto',
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              display: 'inline-block',
              color: theme.palette.success.main,
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            {score}/{totalQuestions}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
            }}
          >
            {percentage.toFixed(1)}% Correct
          </Typography>
        </Box>

        {showChart && (
          <Box sx={{ mb: 4 }}>
            <Pie data={chartData} options={chartOptions} />
          </Box>
        )}

        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'center',
          }}
        >
          Your performance is shown in the pie chart above. The green section represents your correct answers,
          while the red section shows the questions you missed.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => navigate('/quizzes')}
        >
          Home
        </Button>
      </Paper>
    </motion.div>
  );
};

export default ScoreDisplay;
