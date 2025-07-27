import React, { useState } from 'react';
import styled from 'styled-components';
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

const FilterSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button`
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

const SuppliersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const SupplierCard = styled(motion.div)`
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

const SupplierHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SupplierInfo = styled.div`
  flex: 1;
`;

const SupplierName = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SupplierCategory = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span`
  color: ${({ filled }) => filled ? '#F59E0B' : '#D1D5DB'};
  font-size: 18px;
`;

const RatingText = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md};
`;

const ReviewCount = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const SupplierStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background: rgba(255, 255, 255, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const RecentReview = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ReviewText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.4;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-style: italic;
`;

const ReviewAuthor = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSize.xs};
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ActionButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background: ${({ variant, theme }) => 
    variant === 'primary' ? theme.gradients.secondary : 'rgba(255, 255, 255, 0.5)'};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.small};
  }
`;

const SupplierRatings = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');

  const suppliers = [
    {
      id: 1,
      name: 'Fresh Farms Supply Co.',
      category: 'Fruits & Vegetables',
      rating: 4.8,
      reviewCount: 156,
      deliveryTime: '2-4 hrs',
      reliability: '98%',
      priceRange: '$$',
      recentReview: {
        text: 'Excellent quality vegetables, always fresh and delivered on time. Highly recommended!',
        author: 'Raj Food Stall'
      }
    },
    {
      id: 2,
      name: 'Spice World Distributors',
      category: 'Spices & Seasonings',
      rating: 4.6,
      reviewCount: 203,
      deliveryTime: '1-2 days',
      reliability: '95%',
      priceRange: '$$$',
      recentReview: {
        text: 'Great variety of spices at competitive prices. Packaging could be better.',
        author: 'Street Kitchen'
      }
    },
    {
      id: 3,
      name: 'Grain Masters Ltd.',
      category: 'Grains & Cereals',
      rating: 4.9,
      reviewCount: 89,
      deliveryTime: '3-5 hrs',
      reliability: '99%',
      priceRange: '$$',
      recentReview: {
        text: 'Best quality rice in the city. Never had any issues with their service.',
        author: 'Biryani Corner'
      }
    },
    {
      id: 4,
      name: 'Dairy Fresh Express',
      category: 'Dairy Products',
      rating: 4.4,
      reviewCount: 127,
      deliveryTime: '1-3 hrs',
      reliability: '92%',
      priceRange: '$$',
      recentReview: {
        text: 'Good quality dairy products but sometimes delivery is delayed.',
        author: 'Chai Point'
      }
    },
    {
      id: 5,
      name: 'Packaging Pro Solutions',
      category: 'Packaging Materials',
      rating: 4.7,
      reviewCount: 94,
      deliveryTime: '4-6 hrs',
      reliability: '96%',
      priceRange: '$',
      recentReview: {
        text: 'Eco-friendly packaging options are great. Competitive pricing too.',
        author: 'Green Eats'
      }
    },
    {
      id: 6,
      name: 'Metro Food Distribution',
      category: 'Mixed Supplies',
      rating: 4.3,
      reviewCount: 178,
      deliveryTime: '2-4 hrs',
      reliability: '88%',
      priceRange: '$$$',
      recentReview: {
        text: 'Wide variety of products but quality can be inconsistent sometimes.',
        author: 'Food Truck Express'
      }
    }
  ];

  const categories = ['all', 'Fruits & Vegetables', 'Spices & Seasonings', 'Grains & Cereals', 'Dairy Products', 'Packaging Materials'];

  const filteredSuppliers = activeFilter === 'all' 
    ? suppliers 
    : suppliers.filter(supplier => supplier.category === activeFilter);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} filled={index < Math.floor(rating)}>
        ★
      </Star>
    ));
  };

  return (
    <PageContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <PageContent>
        <PageHeader>
          <PageTitle>Supplier Ratings & Reviews</PageTitle>
          <PageSubtitle>
            Discover trusted suppliers based on community reviews and performance ratings
          </PageSubtitle>
        </PageHeader>

        <FilterSection>
          {categories.map(category => (
            <FilterButton
              key={category}
              active={activeFilter === category}
              onClick={() => setActiveFilter(category)}
            >
              {category === 'all' ? 'All Categories' : category}
            </FilterButton>
          ))}
        </FilterSection>

        <SuppliersGrid>
          {filteredSuppliers.map((supplier, index) => (
            <SupplierCard
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <SupplierHeader>
                <SupplierInfo>
                  <SupplierName>{supplier.name}</SupplierName>
                  <SupplierCategory>{supplier.category}</SupplierCategory>
                  <RatingSection>
                    <StarsContainer>
                      {renderStars(supplier.rating)}
                    </StarsContainer>
                    <RatingText>{supplier.rating}</RatingText>
                    <ReviewCount>({supplier.reviewCount} reviews)</ReviewCount>
                  </RatingSection>
                </SupplierInfo>
              </SupplierHeader>

              <SupplierStats>
                <StatItem>
                  <StatValue>{supplier.deliveryTime}</StatValue>
                  <StatLabel>Delivery Time</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{supplier.reliability}</StatValue>
                  <StatLabel>Reliability</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{supplier.priceRange}</StatValue>
                  <StatLabel>Price Range</StatLabel>
                </StatItem>
              </SupplierStats>

              <RecentReview>
                <ReviewText>"{supplier.recentReview.text}"</ReviewText>
                <ReviewAuthor>- {supplier.recentReview.author}</ReviewAuthor>
              </RecentReview>

              <ActionButtons>
                <ActionButton variant="primary">View Profile</ActionButton>
                <ActionButton>Write Review</ActionButton>
              </ActionButtons>
            </SupplierCard>
          ))}
        </SuppliersGrid>
      </PageContent>
    </PageContainer>
  );
};

export default SupplierRatings;
