import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const PageContainer = styled(motion.div)`
  min-height: calc(100vh - 80px);
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.gradients.primary};
`;

const PageContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 600px;
  margin: 0 auto;
`;

const ScoreCard = styled(motion.div)`
  background: ${({ theme }) => theme.gradients.card};
  padding: ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const ScoreDisplay = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
`;

const ScoreCircle = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const ScoreBackground = styled.circle`
  fill: none;
  stroke: rgba(220, 198, 160, 0.3);
  stroke-width: 8;
`;

const ScoreProgress = styled(motion.circle)`
  fill: none;
  stroke: ${({ theme }) => theme.colors.accent};
  stroke-width: 8;
  stroke-linecap: round;
`;

const ScoreText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const ScoreNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const ScoreLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ScoreLevel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ score, theme }) => {
    if (score >= 750) return theme.colors.success; // Green
    if (score >= 650) return theme.colors.warning; // Yellow
    return theme.colors.error; // Red
  }};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FactorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const FactorCard = styled(motion.div)`
  background: ${({ theme }) => theme.gradients.card};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const FactorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FactorTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const FactorScore = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ score, theme }) => {
    if (score >= 80) return theme.colors.success;
    if (score >= 60) return theme.colors.warning;
    return theme.colors.error;
  }};
`;

const FactorDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(108, 123, 139, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${({ score, theme }) => {
    if (score >= 80) return theme.colors.success;
    if (score >= 60) return theme.colors.warning;
    return theme.colors.error;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

const ImprovementSection = styled.div`
  background: ${({ theme }) => theme.gradients.card};
  padding: ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const ImprovementTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const TipsList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TipItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.3);
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
`;

const TipText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.5;
  margin: 0;
`;

const CivilScore = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Mock data - in real app, this would come from backend
  const civilScoreData = {
    overallScore: 720,
    level: 'Good',
    factors: [
      {
        name: 'Payment History',
        score: 85,
        description: 'Track record of timely payments to suppliers',
        weight: '35%'
      },
      {
        name: 'Business Longevity',
        score: 75,
        description: 'How long your business has been operating',
        weight: '25%'
      },
      {
        name: 'Order Frequency',
        score: 80,
        description: 'Consistency in placing orders',
        weight: '20%'
      },
      {
        name: 'Community Engagement',
        score: 65,
        description: 'Participation in community activities and reviews',
        weight: '10%'
      },
      {
        name: 'Financial Stability',
        score: 70,
        description: 'Based on order sizes and payment patterns',
        weight: '10%'
      }
    ],
    improvementTips: [
      'Maintain consistent payment schedules to improve your payment history score',
      'Engage more with the community by leaving reviews and participating in group buys',
      'Consider increasing your order frequency for better supplier relationships',
      'Complete your business profile with additional verification documents',
      'Maintain steady order volumes to demonstrate financial stability'
    ]
  };

  useEffect(() => {
    setScore(civilScoreData.overallScore);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = score / 50;
      if (animatedScore < score) {
        setAnimatedScore(prev => Math.min(prev + increment, score));
      }
    }, 20);

    return () => clearTimeout(timer);
  }, [animatedScore, score]);

  const getScoreLevel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  const circumference = 2 * Math.PI * 80;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 1000) * circumference;

  return (
    <PageContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <PageContent>
        <PageHeader>
          <PageTitle>Your Civil Score</PageTitle>
          <PageSubtitle>
            AI-powered creditworthiness assessment based on your business behavior and community engagement
          </PageSubtitle>
        </PageHeader>

        <ScoreCard
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ScoreLevel score={score}>
            {getScoreLevel(score)}
          </ScoreLevel>
          
          <ScoreDisplay>
            <ScoreCircle>
              <ScoreBackground
                cx="100"
                cy="100"
                r="80"
              />
              <ScoreProgress
                cx="100"
                cy="100"
                r="80"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </ScoreCircle>
            <ScoreText>
              <ScoreNumber>{Math.round(animatedScore)}</ScoreNumber>
              <ScoreLabel>out of 1000</ScoreLabel>
            </ScoreText>
          </ScoreDisplay>

          <p style={{ color: theme.colors.textLight, fontSize: '16px', lineHeight: '1.5' }}>
            Your Civil Score reflects your creditworthiness and reliability as a business partner in the vendor community.
          </p>
        </ScoreCard>

        <FactorsGrid>
          {civilScoreData.factors.map((factor, index) => (
            <FactorCard
              key={factor.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <FactorHeader>
                <FactorTitle>{factor.name}</FactorTitle>
                <FactorScore score={factor.score}>{factor.score}/100</FactorScore>
              </FactorHeader>
              
              <FactorDescription>{factor.description}</FactorDescription>
              
              <ProgressBar>
                <ProgressFill
                  score={factor.score}
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.score}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </ProgressBar>
              
              <div style={{ 
                marginTop: '8px', 
                fontSize: '14px', 
                color: theme.colors.textMuted,
                textAlign: 'right'
              }}>
                Weight: {factor.weight}
              </div>
            </FactorCard>
          ))}
        </FactorsGrid>

        <ImprovementSection>
          <ImprovementTitle>How to Improve Your Civil Score</ImprovementTitle>
          <TipsList>
            {civilScoreData.improvementTips.map((tip, index) => (
              <TipItem
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <TipText>{tip}</TipText>
              </TipItem>
            ))}
          </TipsList>
        </ImprovementSection>
      </PageContent>
    </PageContainer>
  );
};

export default CivilScore;
