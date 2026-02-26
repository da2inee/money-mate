// src/components/common/MButton.tsx
import React from 'react';
import Button from '@mui/material/Button';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type ButtonVariant = 'BACK' | 'CATEGORY' | 'DESCRIPTION' | 'NEXT' | 'CORRECT' | 'PRIMARY';

interface MButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  sx?: SxProps<Theme>;
}

const variantStyles: Record<ButtonVariant, SxProps<Theme>> = {
  CATEGORY: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#0f172a',
    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
    '&:hover': {
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.45)',
      transform: 'translateY(-2px)',
    },
  },
  BACK: {
    color: '#94a3b8',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.9375rem',
    fontWeight: 600,
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: 'auto',
    justifyContent: 'flex-start',
    borderRadius: '14px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      color: '#f8fafc',
    },
  },
  DESCRIPTION: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#0f172a',
    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
    '&:hover': {
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
    },
  },
  NEXT: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#0f172a',
    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
    '&:hover': {
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
    },
  },
  CORRECT: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#0f172a',
    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
    '&:hover': {
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
    },
  },
  PRIMARY: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#0f172a',
    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
    '&:hover': {
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
    },
  },
} as const;

const MButton: React.FC<MButtonProps> = ({ label, onClick, sx, variant = 'PRIMARY' }) => {
  const isBack = variant === 'BACK';
  const baseSx = {
    width: isBack ? 'auto' : '200px',
    height: isBack ? 44 : 52,
    fontSize: '1rem',
    fontWeight: 700,
    borderRadius: '14px',
    textTransform: 'none' as const,
    transition: 'transform 0.2s ease, box-shadow 0.25s ease',
    '&:active': !isBack ? { transform: 'translateY(0)' } : {},
  };
  const combinedSx = {
    ...baseSx,
    ...(variantStyles[variant] as object),
    ...(sx && typeof sx === 'object' && !Array.isArray(sx) ? (sx as object) : {}),
  } as SxProps<Theme>;
  return (
    <Button
      variant="text"
      onClick={onClick}
      startIcon={variant === 'BACK' ? <ArrowBackIcon sx={{ fontSize: 20 }} /> : undefined}
      sx={combinedSx}
    >
      {label}
    </Button>
  );
};

export default MButton;
