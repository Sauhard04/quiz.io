import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import './ThreeDLoader.css';

const TYPING_TEXT = 'Getting Questions Ready...';

const ThreeDLoader: React.FC = () => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(TYPING_TEXT.slice(0, i + 1));
      i++;
      if (i === TYPING_TEXT.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontFamily: 'monospace', letterSpacing: 1 }}>
        {displayedText}
      </Typography>
      <div className="threed-loader">
        <div className="cube">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face right"></div>
          <div className="face left"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>
    </Box>
  );
};

export default ThreeDLoader;
