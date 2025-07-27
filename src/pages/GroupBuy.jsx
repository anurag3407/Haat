import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { groupBuyAPI } from '../services/api';
import toast from 'react-hot-toast';

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

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const Tab = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background: ${({ active, theme }) => 
    active ? theme.gradients.secondary : 'rgba(255, 255, 255, 0.5)'};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  font-family: inherit;

  &:hover {
    background: ${({ theme }) => theme.gradients.secondary};
  }
`;

const GroupBuyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const GroupBuyCard = styled(motion.div)`
  background: ${({ theme }) => theme.gradients.card};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProductCategory = styled.span`
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const GroupBuyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const GroupBuyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProgressSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(220, 198, 160, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${({ theme }) => theme.gradients.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PriceInfo = styled.div`
  flex: 1;
`;

const CurrentPrice = styled.div`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const OriginalPrice = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: line-through;
`;

const JoinButton = styled.button`
  background: ${({ theme }) => theme.gradients.secondary};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  font-family: inherit;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.textLight};
`;

const GroupBuy = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('available');

  const groupBuyData = [
    {
      id: 1,
      title: 'Bulk Rice Order - Basmati Premium',
      category: 'Grains',
      description: 'High-quality basmati rice in bulk quantities. Perfect for restaurants and food vendors.',
      currentParticipants: 8,
      targetParticipants: 15,
      currentPrice: 2200,
      originalPrice: 2800,
      deadline: '2 days left',
      organizer: 'Raj Food Stall'
    },
    {
      id: 2,
      title: 'Fresh Vegetables Bundle',
      category: 'Produce',
      description: 'Daily fresh vegetables including onions, potatoes, tomatoes, and seasonal greens.',
      currentParticipants: 12,
      targetParticipants: 20,
      currentPrice: 1200,
      originalPrice: 1500,
      deadline: '5 days left',
      organizer: 'Green Veggie Cart'
    },
    {
      id: 3,
      title: 'Cooking Oil - Sunflower 15L',
      category: 'Oils',
      description: 'Premium sunflower cooking oil in bulk packaging. Great for street food vendors.',
      currentParticipants: 6,
      targetParticipants: 10,
      currentPrice: 1800,
      originalPrice: 2200,
      deadline: '1 day left',
      organizer: 'Spice Hub'
    },
    {
      id: 4,
      title: 'Disposable Containers & Packaging',
      category: 'Packaging',
      description: 'Eco-friendly disposable containers, cups, and packaging materials for food vendors.',
      currentParticipants: 15,
      targetParticipants: 25,
      currentPrice: 800,
      originalPrice: 1200,
      deadline: '3 days left',
      organizer: 'Food Pack Solutions'
    }
  ];

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const filteredData = activeTab === 'available' 
    ? groupBuyData.filter(item => item.currentParticipants < item.targetParticipants)
    : groupBuyData.filter(item => item.currentParticipants >= item.targetParticipants);

  return (
    <PageContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <PageContent>
        <PageHeader>
          <PageTitle>Group Buy Marketplace</PageTitle>
          <PageSubtitle>
            Join forces with other vendors to unlock bulk pricing and maximize your savings
          </PageSubtitle>
        </PageHeader>

        <TabsContainer>
          <Tab 
            active={activeTab === 'available'} 
            onClick={() => setActiveTab('available')}
          >
            Available Orders ({groupBuyData.filter(item => item.currentParticipants < item.targetParticipants).length})
          </Tab>
          <Tab 
            active={activeTab === 'completed'} 
            onClick={() => setActiveTab('completed')}
          >
            Completed Orders ({groupBuyData.filter(item => item.currentParticipants >= item.targetParticipants).length})
          </Tab>
        </TabsContainer>

        {filteredData.length > 0 ? (
          <GroupBuyGrid>
            {filteredData.map((groupBuy, index) => (
              <GroupBuyCard
                key={groupBuy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <CardHeader>
                  <div>
                    <ProductCategory>{groupBuy.category}</ProductCategory>
                    <GroupBuyTitle>{groupBuy.title}</GroupBuyTitle>
                  </div>
                </CardHeader>

                <GroupBuyDescription>{groupBuy.description}</GroupBuyDescription>

                <ProgressSection>
                  <ProgressLabel>
                    <ProgressText>
                      {groupBuy.currentParticipants} / {groupBuy.targetParticipants} participants
                    </ProgressText>
                    <ProgressText>{groupBuy.deadline}</ProgressText>
                  </ProgressLabel>
                  <ProgressBar>
                    <ProgressFill
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${getProgressPercentage(groupBuy.currentParticipants, groupBuy.targetParticipants)}%` 
                      }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </ProgressBar>
                </ProgressSection>

                <CardFooter>
                  <PriceInfo>
                    <CurrentPrice>₹{groupBuy.currentPrice.toLocaleString()}</CurrentPrice>
                    <OriginalPrice>₹{groupBuy.originalPrice.toLocaleString()}</OriginalPrice>
                  </PriceInfo>
                  {activeTab === 'available' && (
                    <JoinButton>Join Group</JoinButton>
                  )}
                </CardFooter>
              </GroupBuyCard>
            ))}
          </GroupBuyGrid>
        ) : (
          <EmptyState>
            <h3>No {activeTab} group buy orders found</h3>
            <p>Check back later for new opportunities to save on bulk purchases!</p>
          </EmptyState>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default GroupBuy;
