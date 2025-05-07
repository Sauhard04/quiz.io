import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

const AppButton: React.FC<ButtonProps> = ({ sx, ...props }) => {
  const theme = useTheme();
  return (
    <Button
      {...props}
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        fontWeight: 600,
        borderRadius: 2,
        textTransform: 'none',
        boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
        transition: 'all 0.2s',
        fontSize: '1rem',
        py: 1.2,
        px: 3,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
          color: '#fff',
          boxShadow: '0 4px 16px rgba(33,150,243,0.18)',
        },
        ...(typeof sx === 'function' ? sx(theme) : sx),
      }}
    />
  );
};

export default AppButton;
