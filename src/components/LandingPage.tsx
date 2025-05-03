import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Container, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {

  const [gradient, setGradient] = useState('45deg, #2196F3 0%, #00C853 100%');
  const [buttonColor, setButtonColor] = useState('#2196F3');

  useEffect(() => {
    const interval = setInterval(() => {
      const randomAngle = Math.floor(Math.random() * 360);
      const randomColor1 = generateRandomColor();
      const randomColor2 = generateRandomColor();
      const newGradient = `linear-gradient(${randomAngle}deg, ${randomColor1} 0%, ${randomColor2} 100%)`;
      setGradient(newGradient);
      setButtonColor(randomColor1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 128) + 128;
    const g = Math.floor(Math.random() * 128) + 128;
    const b = Math.floor(Math.random() * 128) + 128;
    return `rgb(${r}, ${g}, ${b})`;
  }

  const AnimatedPaper = styled(motion(Paper))(() => ({
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-10px) scale(1.02)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    },
  }));

  const AnimatedButton = styled(motion(Button))(({ theme }) => ({
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: buttonColor,
    '&:hover': {
      transform: 'translateY(-2px) scale(1.02)',
      backgroundColor: theme.palette.primary.dark,
    },
  }));

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <AnimatedPaper 
          initial={{ 
            opacity: 0, 
            y: 20,
            scale: 0.95
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: 1
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            delay: 0
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          whileTap={{ 
            scale: 0.95,
            transition: { duration: 0.1 }
          }}
          sx={{ 
            p: 4,
            mx: 'auto',
            maxWidth: 600,
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'background.paper'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut",
              delay: 0
            }}
            style={{
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              className="rgb-gaming-heading"
              sx={{
                fontWeight: 'bold',
                mb: 4,
                // Remove all inline background/gradient/clip/transition for sync with CSS
              }}
            >
              Quiz.IO
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom
              sx={{ 
                mb: 4,
                color: 'text.secondary'
              }}
            >
              Your Ultimate Quiz Platform
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4,
                color: 'text.secondary'
              }}
            >
              Dive into a world of knowledge with our interactive quizzes. Test your skills, learn new things, and compete with others.
            </Typography>
          </motion.div>

          <Link to="/quizzes" style={{ textDecoration: 'none' }}>
            <AnimatedButton
              variant="contained" 
              size="large"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                '&:hover': {
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              View Active Quizzes
            </AnimatedButton>
          </Link>
        </AnimatedPaper>
      </Box>
    </Container>
  );
};

export default LandingPage;
