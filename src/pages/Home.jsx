import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

// Hero Section
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.gradients.primary};
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  text-align: center;
  z-index: 2;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: ${({ theme }) => theme.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.1;
  
  .highlight {
    background: ${({ theme }) => theme.gradients.secondary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

const CTAButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['2xl']};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  transition: ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  min-width: 160px;
  
  &.primary {
    background: ${({ theme }) => theme.colors.accent};
    color: white;
    
    &:hover {
      background: ${({ theme }) => theme.colors.text};
      box-shadow: ${({ theme }) => theme.shadows.large};
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    border: 2px solid ${({ theme }) => theme.colors.accent};
    
    &:hover {
      background: ${({ theme }) => theme.colors.accent};
      color: white;
      transform: translateY(-2px);
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    max-width: 300px;
  }
`;

// Floating Elements
const FloatingElement = styled(motion.div)`
  position: absolute;
  opacity: 0.1;
  pointer-events: none;
`;

const FloatingCircle = styled(FloatingElement)`
  width: ${props => props.size || '100px'};
  height: ${props => props.size || '100px'};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
`;

const FloatingSquare = styled(FloatingElement)`
  width: ${props => props.size || '80px'};
  height: ${props => props.size || '80px'};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: ${({ theme }) => theme.colors.primary};
  transform: rotate(45deg);
`;

// Features Section
const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing['5xl']} 0;
  background: ${({ theme }) => theme.colors.surface};
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled(motion.h2)`
  font-size: ${({ theme }) => theme.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSize['3xl']};
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
`;

const FeatureCard = styled(motion.div)`
  background: ${({ theme }) => theme.gradients.card};
  padding: ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.xlarge};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  transition: ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.large};
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
`;

// How It Works Section
const HowItWorksSection = styled.section`
  padding: ${({ theme }) => theme.spacing['5xl']} 0;
  background: ${({ theme }) => theme.gradients.primary};
`;

const StepsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const StepCard = styled(motion.div)`
  text-align: center;
  position: relative;
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const StepTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const floatingVariants = {
  animate: {
    y: [-20, 20, -20],
    x: [-10, 10, -10],
    rotate: [0, 180, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: '🤝',
      title: 'Group Buying Power',
      description: 'Join with other vendors to get better prices through bulk ordering and shared delivery costs.'
    },
    {
      icon: '⭐',
      title: 'Civil Score System',
      description: 'Build your reputation with our AI-powered creditworthiness scoring that helps you access better deals.'
    },
    {
      icon: '📍',
      title: 'Real-time Tracking',
      description: 'Track your orders live with Google Maps integration and get accurate delivery estimates.'
    },
    {
      icon: '🏆',
      title: 'Supplier Ratings',
      description: 'Review and rate suppliers to help the community find the most reliable partners.'
    },
    {
      icon: '🤖',
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations, success stories, and business tips powered by Gemini AI.'
    },
    {
      icon: '💰',
      title: 'Cost Savings',
      description: 'Save money through group discounts, optimized routes, and competitive supplier bidding.'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Sign Up',
      description: 'Create your account as a vendor or supplier and set up your profile with location and preferences.'
    },
    {
      number: 2,
      title: 'Connect & Order',
      description: 'Start or join group orders, connect with suppliers, and place orders with competitive bidding.'
    },
    {
      number: 3,
      title: 'Track & Review',
      description: 'Monitor your orders in real-time, receive deliveries, and rate your experience to build community trust.'
    }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <HeroSection>
        {/* Floating Background Elements */}
        <FloatingCircle
          size="150px"
          style={{ top: '10%', left: '10%' }}
          variants={floatingVariants}
          animate="animate"
        />
        <FloatingSquare
          size="100px"
          style={{ top: '20%', right: '15%' }}
          variants={floatingVariants}
          animate="animate"
        />
        <FloatingCircle
          size="200px"
          style={{ bottom: '10%', left: '5%' }}
          variants={floatingVariants}
          animate="animate"
        />
        <FloatingSquare
          size="120px"
          style={{ bottom: '20%', right: '10%' }}
          variants={floatingVariants}
          animate="animate"
        />

        <HeroContent>
          <HeroTitle variants={itemVariants}>
            Revolutionize Your <span className="highlight">Street Vendor</span> Supply Chain
          </HeroTitle>
          
          <HeroSubtitle variants={itemVariants}>
            Join thousands of vendors and suppliers in our revolutionary platform that combines 
            group buying power, AI-driven insights, and real-time tracking for smarter business.
          </HeroSubtitle>
          
          <CTAContainer variants={itemVariants}>
            <CTAButton
              className="primary"
              to={isAuthenticated ? '/dashboard' : '/register'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
            </CTAButton>
            
            {!isAuthenticated && (
              <CTAButton
                className="secondary"
                to="/login"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </CTAButton>
            )}
          </CTAContainer>
        </HeroContent>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle variants={itemVariants}>
            Why Choose VendorHub?
          </SectionTitle>
          
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      {/* How It Works Section */}
      <HowItWorksSection>
        <StepsContainer>
          <SectionTitle variants={itemVariants}>
            How It Works
          </SectionTitle>
          
          <StepsGrid>
            {steps.map((step, index) => (
              <StepCard key={index} variants={itemVariants}>
                <StepNumber>{step.number}</StepNumber>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </StepCard>
            ))}
          </StepsGrid>
        </StepsContainer>
      </HowItWorksSection>
    </motion.div>
  );
};

export default Home;
