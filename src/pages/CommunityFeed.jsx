import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp, 
  Star, 
  Users, 
  Filter,
  Sparkles,
  RefreshCw,
  Award,
  Target,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const PageContainer = styled(motion.div)`
  min-height: calc(100vh - 80px);
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Controls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const FilterButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme, active }) => active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, active }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, active }) => active ? 'white' : theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const RefreshButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FeedContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const MainFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    order: -1;
  }
`;

const PostCard = styled(motion.div)`
  background: ${({ theme }) => theme.gradients.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PostAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.gradients.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const PostTime = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const PostType = styled.span`
  background: ${({ type, theme }) => 
    type === 'success_story' ? theme.colors.success + '20' :
    type === 'tips' ? theme.colors.primary + '20' :
    type === 'market_insights' ? theme.colors.warning + '20' :
    theme.colors.accent + '20'
  };
  color: ${({ type, theme }) => 
    type === 'success_story' ? theme.colors.success :
    type === 'tips' ? theme.colors.primary :
    type === 'market_insights' ? theme.colors.warning :
    theme.colors.accent
  };
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 600;
  text-transform: uppercase;
`;

const PostTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.4;
`;

const PostContent = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const PostTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSize.xs};
  border: 1px solid ${({ theme }) => theme.colors.primary + '30'};
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActionGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSize.sm};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }

  &.liked {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const SidebarCard = styled(motion.div)`
  background: ${({ theme }) => theme.gradients.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SidebarTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InsightItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background + '50'};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border-left: 4px solid ${({ impact, theme }) => 
    impact === 'high' ? theme.colors.error :
    impact === 'medium' ? theme.colors.warning :
    theme.colors.primary
  };
`;

const InsightTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const InsightText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.4;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.error + '10'};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 1px solid ${({ theme }) => theme.colors.error + '30'};
`;

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [likedPosts, setLikedPosts] = useState(new Set());

  const filters = [
    { id: 'all', label: 'All Posts', icon: Filter },
    { id: 'success_stories', label: 'Success Stories', icon: Award },
    { id: 'tips', label: 'Tips & Advice', icon: Lightbulb },
    { id: 'market_insights', label: 'Market Insights', icon: BarChart3 }
  ];

  const fetchCommunityFeed = async (type = 'all') => {
    try {
      const response = await api.get(`/community/feed?type=${type}&limit=10`);
      setPosts(response.data.posts || []);
    } catch (err) {
      console.error('Error fetching community feed:', err);
      setError('Failed to load community feed');
    }
  };

  const fetchMarketInsights = async () => {
    try {
      const response = await api.get('/community/insights');
      setInsights(response.data.insights || []);
    } catch (err) {
      console.error('Error fetching market insights:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchCommunityFeed(activeFilter),
      fetchMarketInsights()
    ]);
    setRefreshing(false);
  };

  const handleFilterChange = async (filter) => {
    if (filter === activeFilter) return;
    
    setActiveFilter(filter);
    setLoading(true);
    await fetchCommunityFeed(filter);
    setLoading(false);
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });

    // Update post likes count
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = likedPosts.has(postId);
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return postDate.toLocaleDateString();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success_story': return Award;
      case 'tips': return Lightbulb;
      case 'market_insights': return BarChart3;
      default: return Sparkles;
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCommunityFeed(),
        fetchMarketInsights()
      ]);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <RefreshButton onClick={handleRefresh} style={{ marginTop: '1rem' }}>
            <RefreshCw size={16} />
            Try Again
          </RefreshButton>
        </ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <Title>
          <Sparkles size={32} />
          Community Feed
        </Title>
        <Controls>
          {filters.map(filter => {
            const Icon = filter.icon;
            return (
              <FilterButton
                key={filter.id}
                active={activeFilter === filter.id}
                onClick={() => handleFilterChange(filter.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={16} />
                {filter.label}
              </FilterButton>
            );
          })}
          <RefreshButton
            onClick={handleRefresh}
            disabled={refreshing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </RefreshButton>
        </Controls>
      </Header>

      <FeedContainer>
        <MainFeed>
          <AnimatePresence mode="wait">
            {posts.map((post, index) => {
              const TypeIcon = getTypeIcon(post.type);
              return (
                <PostCard
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PostHeader>
                    <PostAuthor>
                      <Avatar>
                        <TypeIcon size={20} />
                      </Avatar>
                      <AuthorInfo>
                        <AuthorName>{post.author?.name || 'Community'}</AuthorName>
                        <PostTime>{formatTimeAgo(post.createdAt)}</PostTime>
                      </AuthorInfo>
                    </PostAuthor>
                    <PostType type={post.type}>
                      {post.type.replace('_', ' ')}
                    </PostType>
                  </PostHeader>

                  <PostTitle>{post.title}</PostTitle>
                  <PostContent>{post.content}</PostContent>

                  {post.tags && post.tags.length > 0 && (
                    <PostTags>
                      {post.tags.map((tag, idx) => (
                        <Tag key={idx}>#{tag}</Tag>
                      ))}
                    </PostTags>
                  )}

                  <PostActions>
                    <ActionGroup>
                      <ActionButton
                        className={likedPosts.has(post.id) ? 'liked' : ''}
                        onClick={() => handleLike(post.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart 
                          size={16} 
                          fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} 
                        />
                        {post.likes || 0}
                      </ActionButton>
                      <ActionButton>
                        <MessageCircle size={16} />
                        {post.comments || 0}
                      </ActionButton>
                      <ActionButton>
                        <Share2 size={16} />
                        {post.shares || 0}
                      </ActionButton>
                    </ActionGroup>
                  </PostActions>
                </PostCard>
              );
            })}
          </AnimatePresence>
        </MainFeed>

        <Sidebar>
          <SidebarCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SidebarTitle>
              <TrendingUp size={20} />
              Market Insights
            </SidebarTitle>
            {insights.map((insight, index) => (
              <InsightItem key={insight.id || index} impact={insight.impact_level}>
                <InsightTitle>{insight.title}</InsightTitle>
                <InsightText>{insight.insight}</InsightText>
              </InsightItem>
            ))}
          </SidebarCard>

          <SidebarCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SidebarTitle>
              <Users size={20} />
              Community Stats
            </SidebarTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Active Vendors:</span>
                <strong>1,247</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Active Suppliers:</span>
                <strong>856</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Orders Today:</span>
                <strong>342</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Success Rate:</span>
                <strong>94.2%</strong>
              </div>
            </div>
          </SidebarCard>
        </Sidebar>
      </FeedContainer>
    </PageContainer>
  );
};

export default CommunityFeed;
