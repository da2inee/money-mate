// src/components/common/MyButton.tsx
import React from 'react';
import Button from '@mui/material/Button';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

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
    backgroundColor: '#e0e0e0',  //연회색
    color: '#000',  //텍스트 색 검정
    display: "flex",
    alignSelf:"flex-start",
    '&:hover': {
      backgroundColor: '#bdbdbd', //hover시 조금 더 진한 회색
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
        variant="contained"
        onClick={onClick}
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
