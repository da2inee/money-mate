// src/components/common/MyButton.tsx
import React from 'react';
import Button from '@mui/material/Button';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // 추가

type ButtonVariant = 'BACK' | 'CATEGORY' | 'DESCRIPTION' | 'NEXT' | 'CORRECT' | 'PRIMARY'; 

interface MButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  sx?: SxProps<Theme>; // 추가 스타일 override 가능
}

const variantStyles: Record<ButtonVariant, SxProps<Theme>> = {
  CATEGORY: {
    backgroundColor: '#FFB6B9',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#FF8C94',
    },
  },
  BACK: {
    color: grey[800],
    border: '1px solid #ccc',
    backgroundColor: 'transparent',
    fontSize: '15px',
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    justifyContent: 'left',
    '&:hover': {
      backgroundColor: grey[200],
    },
  },
  DESCRIPTION: {
    backgroundColor: '#F44336',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#D32F2F',
    },
  },
  NEXT: {
    backgroundColor: '#F44336',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#D32F2F',
    },
  },
  CORRECT: {
    backgroundColor: '#F44336',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#D32F2F',
    },
  },
  PRIMARY: {
    backgroundColor: '#F44336',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#D32F2F',
    },
  },
} as const;

const MButton: React.FC<MButtonProps>  = ({label, onClick,sx, variant='PRIMARY'}) => {
  return (
        <Button
        variant="text"
        onClick={onClick}
        startIcon={variant==='BACK'?<ArrowBackIcon/>:undefined}
        sx={{
            width: '200px',
            height: '50px',
            fontSize: '16px',
            borderRadius: '12px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
            ...variantStyles[variant],
        }}
        >
        {label}
        </Button>

  );
};

export default MButton;
