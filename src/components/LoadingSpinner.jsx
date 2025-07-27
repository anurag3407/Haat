import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const SpinnerContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: ${props => props.fullScreen ? '100vh' : '200px'};
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
`;

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: 3px solid ${({ theme }) => theme.colors.surface};
  border-top: 3px solid ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  text-align: center;
  animation: ${pulse} 2s ease-in-out infinite;
  margin: 0;
`;

const LoadingDots = styled.span`
  &::after {
    content: '';
    animation: ${pulse} 1.5s ease-in-out infinite;
  }
`;

const CreamSpinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top: 3px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    border: 2px solid transparent;
    border-bottom: 2px solid ${({ theme }) => theme.colors.accent};
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite reverse;
  }
`;

const LoadingSpinner = ({ 
  size = '40px', 
  fullScreen = false, 
  text = 'Loading', 
  variant = 'default' 
}) => {
  const SpinnerComponent = variant === 'cream' ? CreamSpinner : Spinner;

  return (
    <SpinnerContainer 
      fullScreen={fullScreen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <SpinnerWrapper size={size}>
        <SpinnerComponent size={size} />
      </SpinnerWrapper>
      
      {text && (
        <LoadingText>
          {text}
          <LoadingDots />
        </LoadingText>
      )}
    </SpinnerContainer>
  );
};

// Overlay spinner for loading states over content
export const OverlaySpinner = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 244, 230, 0.8);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.overlay};
  border-radius: inherit;
`;

// Inline spinner for buttons
export const InlineSpinner = styled.div`
  display: inline-block;
  width: ${props => props.size || '16px'};
  height: ${props => props.size || '16px'};
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

// Page loading component
export const PageLoader = () => (
  <SpinnerContainer 
    fullScreen
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
  >
    <CreamSpinner size="60px" />
    <LoadingText>
      Loading your dashboard<LoadingDots />
    </LoadingText>
  </SpinnerContainer>
);

// Content placeholder skeleton
export const SkeletonLoader = styled(motion.div)`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 25%,
    ${({ theme }) => theme.colors.primary} 50%,
    ${({ theme }) => theme.colors.surface} 75%
  );
  background-size: 200% 100%;
  animation: ${keyframes`
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  `} 1.5s ease-in-out infinite;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '0 0 8px 0'};
`;

export default LoadingSpinner;
