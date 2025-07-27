const express = require('express');
const axios = require('axios');
const { authenticateToken, requireVendorOrSupplier } = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');

const router = express.Router();

// @route   GET /api/community/news
// @desc    Get AI-generated news related to street vendors and small business
// @access  Private
router.get('/news', authenticateToken, requireVendorOrSupplier, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      category = 'general' // 'general', 'business', 'technology', 'economy'
    } = req.query;

    // Get marketplace context for personalized news
    const userLocation = req.user.location?.city || 'Mumbai';
    const userRole = req.user.role;
    const userCategories = req.user.categories || [];

    // Generate contextual news prompt
    const newsPrompt = `Generate relevant news content for street vendors and small business owners in ${userLocation}, India. 

Context:
- User role: ${userRole}
- User categories: ${userCategories.join(', ') || 'General business'}
- Focus on: street vending, small business, local markets, digital payments, government policies, supply chain

Create ${limit} news articles covering:
1. Government policy updates affecting street vendors
2. Digital payment and technology adoption
3. Market trends and consumer behavior
4. Success stories from small businesses
5. Economic developments impacting local trade
6. Seasonal business opportunities
7. Supply chain and logistics news
8. Financial inclusion and banking updates

Requirements:
- Each article should be 200-400 words
- Include realistic publication details
- Focus on actionable insights for vendors/suppliers
- Maintain professional, informative tone
- Include relevant keywords for street vendors
- Format as JSON array with: title, summary, content, category, source, publishedAt, tags, readTime
- Make content India-specific and relevant to ${userLocation}`;

    try {
      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: newsPrompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      let newsArticles = [];

      try {
        const generatedText = geminiResponse.data.candidates[0].content.parts[0].text;
        const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          newsArticles = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.log('Using fallback news due to parsing error:', parseError);
        newsArticles = generateFallbackNews(limit, category, userLocation, userRole);
      }

      // Enhance articles with additional metadata
      newsArticles = newsArticles.map((article, index) => ({
        id: `news_${Date.now()}_${index}`,
        ...article,
        publishedAt: article.publishedAt || new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        readTime: article.readTime || Math.ceil(article.content?.length / 1000) + ' min read',
        relevanceScore: Math.round((Math.random() * 30 + 70) * 10) / 10, // 70-100% relevance
        engagement: {
          views: Math.floor(Math.random() * 5000) + 500,
          likes: Math.floor(Math.random() * 200) + 20,
          shares: Math.floor(Math.random() * 50) + 5
        },
        aiGenerated: true
      }));

      res.json({
        message: 'News feed generated successfully',
        articles: newsArticles,
        pagination: {
          current: parseInt(page),
          total: newsArticles.length,
          hasNext: false,
          hasPrev: false
        },
        meta: {
          generated_at: new Date().toISOString(),
          location: userLocation,
          user_role: userRole,
          ai_powered: true
        }
      });

    } catch (aiError) {
      console.error('Gemini API error for news:', aiError);

      // Fallback to curated news content
      const fallbackNews = generateFallbackNews(limit, category, userLocation, userRole);

      res.json({
        message: 'News feed generated successfully (fallback mode)',
        articles: fallbackNews.map((article, index) => ({
          id: `fallback_news_${Date.now()}_${index}`,
          ...article,
          publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          readTime: Math.ceil(article.content?.length / 1000) + ' min read',
          relevanceScore: 85,
          engagement: {
            views: Math.floor(Math.random() * 3000) + 300,
            likes: Math.floor(Math.random() * 100) + 15,
            shares: Math.floor(Math.random() * 30) + 3
          },
          aiGenerated: false,
          fallback_mode: true
        })),
        pagination: {
          current: parseInt(page),
          total: fallbackNews.length,
          hasNext: false,
          hasPrev: false
        },
        meta: {
          generated_at: new Date().toISOString(),
          location: userLocation,
          user_role: userRole,
          ai_powered: false,
          fallback_mode: true
        }
      });
    }

  } catch (error) {
    console.error('Community news error:', error);

    res.status(500).json({
      message: 'Server error generating news feed',
      error: 'COMMUNITY_NEWS_ERROR'
    });
  }
});

// @route   GET /api/community/trending
// @desc    Get trending topics and hashtags
// @access  Private
router.get('/trending', authenticateToken, requireVendorOrSupplier, async (req, res) => {
  try {
    // Get recent order data for trending analysis
    const recentOrdersData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$estimatedPrice' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const trendingTopics = recentOrdersData.map(item => ({
      topic: item._id,
      mentions: item.count,
      growth: Math.floor(Math.random() * 50) + 10, // 10-60% growth
      hashtag: `#${item._id.replace(/\s+/g, '').toLowerCase()}`
    }));

    // Add some general trending topics
    const generalTrends = [
      { topic: 'Digital Payments', mentions: 1245, growth: 35, hashtag: '#digitalpayments' },
      { topic: 'Group Buying', mentions: 892, growth: 28, hashtag: '#groupbuying' },
      { topic: 'Organic Products', mentions: 756, growth: 42, hashtag: '#organic' },
      { topic: 'Street Food', mentions: 634, growth: 22, hashtag: '#streetfood' },
      { topic: 'Sustainable Packaging', mentions: 543, growth: 38, hashtag: '#sustainable' }
    ];

    const allTrends = [...trendingTopics, ...generalTrends]
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 10);

    res.json({
      message: 'Trending topics retrieved successfully',
      trends: allTrends,
      updated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Trending topics error:', error);

    res.status(500).json({
      message: 'Server error retrieving trending topics',
      error: 'TRENDING_TOPICS_ERROR'
    });
  }
});

// Helper function to generate fallback news content
function generateFallbackNews(limit, category, location, userRole) {
  const newsTemplates = [
    {
      title: "Mumbai Municipal Corporation Launches Digital Vendor Registration Portal",
      summary: "New online platform simplifies licensing process for street vendors, reducing paperwork and processing time from weeks to days.",
      content: "The Mumbai Municipal Corporation has launched a comprehensive digital platform for street vendor registration and licensing. The new system allows vendors to apply for licenses online, track application status, and receive digital certificates. This initiative is part of the Smart City mission and aims to formalize the street vending sector. Vendors can now upload documents digitally, pay fees online, and receive instant acknowledgments. The portal also provides information about designated vending zones, permitted hours, and compliance requirements. Early adopters report significant time savings, with the entire process now taking 5-7 days instead of several weeks. The system also integrates with the PM SVANidhi scheme for easy access to micro-credit facilities.",
      category: "Government Policy",
      source: "Municipal News Today",
      tags: ["government", "licensing", "digital-transformation", "mumbai", "street-vendors"],
    },
    {
      title: "UPI Transactions Among Street Vendors Surge 340% in Past Year",
      summary: "Digital payment adoption accelerates among small-scale vendors, with government incentives driving the shift from cash-based transactions.",
      content: "Recent data shows a remarkable 340% increase in UPI transactions among street vendors across major Indian cities. The surge is attributed to customer preference for contactless payments, government incentives, and simplified onboarding processes by payment companies. Vendors report increased sales, better financial tracking, and reduced cash handling risks. The PM SVANidhi scheme's integration with digital payments has further encouraged adoption. Many vendors note that younger customers prefer digital payments, making it essential for business growth. Payment companies have introduced vendor-specific features like voice-based confirmations in local languages, offline transaction capabilities, and instant settlement options. Training programs conducted by banks and fintech companies have helped overcome technology barriers. The trend is expected to continue, with experts predicting 80% digital payment adoption among urban vendors by 2025.",
      category: "Technology",
      source: "FinTech Daily",
      tags: ["digital-payments", "upi", "fintech", "growth", "technology-adoption"],
    },
    {
      title: "Seasonal Demand Shifts: Summer Beverage Sales Peak Early This Year",
      summary: "Climate changes and consumer behavior shifts drive earlier peak season for beverage vendors, creating new opportunities and challenges.",
      content: "Beverage vendors across India are experiencing peak season demand nearly three weeks earlier than traditional patterns. Climate data shows above-average temperatures starting in March, coupled with changing consumer preferences for healthier drink options. Fresh juice vendors report 45% higher sales compared to last year, while traditional soft drink vendors see modest 12% growth. The shift presents both opportunities and challenges - vendors need to adjust procurement schedules, manage inventory for longer peak seasons, and adapt to new product preferences. Coconut water, fresh lime water, and sugar-free options are trending upward. Supply chain experts recommend vendors establish multiple supplier relationships to handle extended peak periods. The early season start also means longer working hours and higher revenue potential, but requires better planning for raw material sourcing and storage. Weather forecasts suggest this trend may continue, making adaptation crucial for vendor success.",
      category: "Market Trends",
      source: "Street Business Weekly",
      tags: ["seasonal-trends", "beverages", "market-analysis", "climate-impact", "sales-growth"],
    },
    {
      title: "Group Buying Initiatives Help Small Vendors Reduce Costs by 25%",
      summary: "Collaborative purchasing networks among street vendors demonstrate significant cost savings and improved supplier relationships.",
      content: "Collaborative buying groups among street vendors are showing impressive results, with participants reporting average cost reductions of 25% on bulk purchases. These informal networks, often organized through WhatsApp groups and local associations, allow vendors to pool orders for better pricing from suppliers. The model works particularly well for non-perishable items like packaging materials, cooking oil, and dry goods. Successful groups typically include 8-15 vendors from the same area, enabling them to negotiate directly with wholesalers and manufacturers. Beyond cost savings, vendors report improved product quality, reliable supply chains, and stronger community relationships. The initiative has caught government attention, with several states considering formal support for vendor cooperatives. Technology platforms are emerging to facilitate group buying, offering features like order coordination, payment splitting, and delivery scheduling. Experts suggest this trend could revolutionize small-scale retail, making vendors more competitive against larger retailers while maintaining their local market advantages.",
      category: "Business Strategy",
      source: "Vendor Cooperative News",
      tags: ["group-buying", "cost-reduction", "collaboration", "supply-chain", "community"],
    },
    {
      title: "Health Department Issues New Food Safety Guidelines for Street Vendors",
      summary: "Updated regulations focus on hygiene standards, temperature control, and customer safety, with support programs for compliance.",
      content: "The Health Department has released comprehensive food safety guidelines specifically designed for street food vendors, emphasizing practical hygiene measures and customer safety protocols. The new regulations cover food handling, storage temperatures, water quality, and waste management. Unlike previous guidelines, these include vendor-friendly compliance methods and offer free training programs. Key requirements include hand sanitization stations, covered food displays, potable water usage, and regular health check-ups for food handlers. The department is providing subsidized equipment like refrigerated display units and water purification systems. Compliance support includes multilingual training materials, mobile health units for regular check-ups, and digital certification processes. Vendors meeting standards receive official health certificates, which many customers now actively look for. The initiative aims to balance food safety with livelihood protection, recognizing street food's cultural and economic importance. Early feedback from vendors is positive, with many reporting increased customer confidence and sales after certification. The program is being piloted in major cities before nationwide rollout.",
      category: "Health & Safety",
      source: "Public Health Tribune",
      tags: ["food-safety", "health-regulations", "compliance", "training", "certification"],
    },
    {
      title: "Rising Raw Material Costs Challenge Street Food Vendors' Profit Margins",
      summary: "Inflation in essential ingredients forces vendors to innovate pricing strategies while maintaining customer accessibility.",
      content: "Street food vendors are facing significant challenges as raw material costs rise across categories. Cooking oil prices have increased 28%, flour by 22%, and vegetables show 15-20% inflation over the past six months. Vendors are responding with creative strategies to maintain affordability while preserving profit margins. Some are adjusting portion sizes, others are introducing value meals or combo offers. Many vendors are exploring alternative suppliers, bulk buying cooperatives, and seasonal menu adjustments. The impact varies by location and specialization - vendors near business districts have more pricing flexibility than those in residential areas. Successful vendors are focusing on operational efficiency, reducing waste, and building customer loyalty through consistent quality. Some are diversifying their offerings to include higher-margin items alongside traditional favorites. Industry associations are advocating for government support measures, including subsidized raw materials and easier access to credit. The situation has accelerated adoption of business planning and cost management practices among vendors, traditionally an informal sector. Experts predict the challenges will drive industry consolidation and professionalization.",
      category: "Economics",
      source: "Street Food Economics",
      tags: ["inflation", "raw-materials", "profit-margins", "pricing-strategy", "cost-management"],
    }
  ];

  // Filter by category if specified
  let filteredNews = newsTemplates;
  if (category !== 'general') {
    filteredNews = newsTemplates.filter(news => 
      news.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  // Customize content based on user role
  filteredNews = filteredNews.map(news => ({
    ...news,
    content: userRole === 'supplier' 
      ? news.content.replace(/vendor/g, 'supplier').replace(/Vendor/g, 'Supplier')
      : news.content,
    title: userRole === 'supplier' && news.title.includes('Vendor')
      ? news.title.replace(/Vendor/g, 'Supplier')
      : news.title
  }));

  return filteredNews.slice(0, limit);
}

module.exports = router;
