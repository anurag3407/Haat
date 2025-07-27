import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PageContainer = styled(motion.div)`
  min-height: calc(100vh - 80px);
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlaceholderCard = styled.div`
  background: ${({ theme }) => theme.gradients.card};
  padding: ${({ theme }) => theme.spacing['3xl']};
  border-radius: ${({ theme }) => theme.borderRadius.xlarge};
  box-shadow: ${({ theme }) => theme.shadows.large};
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const PlaceholderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PlaceholderText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.lg};
  line-height: 1.6;
`;

const OrderTracking = () => {
  return (
    <PageContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <PlaceholderCard>
        <PlaceholderTitle>Order Tracking</PlaceholderTitle>
        <PlaceholderText>
          Real-time order tracking with Google Maps integration,
          animated delivery progress, and live status updates.
        </PlaceholderText>
      </PlaceholderCard>
    </PageContainer>
  );
};

export default OrderTracking;
