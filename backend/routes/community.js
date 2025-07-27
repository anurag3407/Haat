const express = require('express');
const axios = require('axios');
const { authenticateToken, requireVendorOrSupplier } = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');

const router = express.Router();

// @route   GET /api/community/feed
// @desc    Get AI-generated community feed content
// @access  Private
router.get('/feed', authenticateToken, requireVendorOrSupplier, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type = 'all' // 'success_stories', 'tips', 'market_insights', 'all'
    } = req.query;
    
    // Get recent activity data for AI context
    const recentOrders = await Order.find({ status: 'completed' })
      .populate('vendor', 'name businessInfo')
      .populate('supplier', 'name businessInfo')
      .sort({ completedAt: -1 })
      .limit(5);
    
    const topSuppliers = await User.find({ 
      role: 'supplier',
      averageRating: { $gte: 4.0 }
    })
    .select('name businessInfo averageRating totalReviews')
    .sort({ averageRating: -1, totalReviews: -1 })
    .limit(3);
    
    // Generate AI content using Gemini
    const prompt = `Generate engaging community feed content for a street vendor supply management platform. 

Recent marketplace activity:
${recentOrders.map(order => 
  `- ${order.vendor?.name || 'Vendor'} completed order "${order.title}" with ${order.supplier?.name || 'Supplier'}`
).join('\n')}

Top performing suppliers:
${topSuppliers.map(supplier => 
  `- ${supplier.name}: ${supplier.businessInfo?.category || 'General'} (${supplier.averageRating}/5, ${supplier.totalReviews} reviews)`
).join('\n')}

Create ${limit} diverse community posts including:
${type === 'all' ? 'success stories, business tips, market insights, and motivational content' : type}

Requirements:
- Each post should be realistic and relevant to street vendors
- Include actionable advice and insights
- Maintain positive, encouraging tone
- Format as JSON array with: title, content, type, tags, engagement metrics
- Content should be 150-300 words each
- Include realistic engagement numbers (likes: 15-85, comments: 3-25, shares: 1-15)`;

    try {
      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      let feedContent = [];
      
      try {
        const generatedText = geminiResponse.data.candidates[0].content.parts[0].text;
        // Extract JSON from the response
        const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          feedContent = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.log('Using fallback content due to parsing error:', parseError);
        // Fallback content if AI parsing fails
        feedContent = generateFallbackContent(limit, type);
      }
      
      // Add timestamps and IDs
      feedContent = feedContent.map((post, index) => ({
        id: `ai_${Date.now()}_${index}`,
        ...post,
        createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random time within last 24h
        author: {
          name: 'VendorHub Community',
          type: 'ai_generated',
          avatar: '/api/avatars/community.png'
        }
      }));
      
      res.json({
        message: 'Community feed generated successfully',
        posts: feedContent,
        pagination: {
          current: parseInt(page),
          total: feedContent.length,
          hasNext: false,
          hasPrev: false
        },
        meta: {
          generated_at: new Date().toISOString(),
          content_type: type,
          ai_powered: true
        }
      });
      
    } catch (aiError) {
      console.error('Gemini API error:', aiError);
      
      // Fallback to static content if AI fails
      const fallbackContent = generateFallbackContent(limit, type);
      
      res.json({
        message: 'Community feed generated successfully (fallback mode)',
        posts: fallbackContent.map((post, index) => ({
          id: `fallback_${Date.now()}_${index}`,
          ...post,
          createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          author: {
            name: 'VendorHub Community',
            type: 'curated',
            avatar: '/api/avatars/community.png'
          }
        })),
        pagination: {
          current: parseInt(page),
          total: fallbackContent.length,
          hasNext: false,
          hasPrev: false
        },
        meta: {
          generated_at: new Date().toISOString(),
          content_type: type,
          ai_powered: false,
          fallback_mode: true
        }
      });
    }

  } catch (error) {
    console.error('Community feed error:', error);
    
    res.status(500).json({
      message: 'Server error generating community feed',
      error: 'COMMUNITY_FEED_ERROR'
    });
  }
});

// @route   GET /api/community/insights
// @desc    Get AI-generated market insights
// @access  Private
router.get('/insights', authenticateToken, requireVendorOrSupplier, async (req, res) => {
  try {
    // Get marketplace data for insights
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgValue: { $avg: '$totalAmount' },
          totalValue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const supplierPerformance = await User.aggregate([
      {
        $match: { role: 'supplier', totalReviews: { $gte: 5 } }
      },
      {
        $group: {
          _id: '$businessInfo.category',
          avgRating: { $avg: '$averageRating' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgRating: -1 } }
    ]);
    
    const prompt = `Analyze this street vendor marketplace data and provide actionable business insights:

Order Statistics by Category:
${orderStats.map(stat => 
  `- ${stat._id}: ${stat.count} orders, $${stat.avgValue.toFixed(2)} avg, $${stat.totalValue.toFixed(2)} total`
).join('\n')}

Supplier Performance by Category:
${supplierPerformance.map(perf => 
  `- ${perf._id}: ${perf.avgRating.toFixed(1)}/5 rating, ${perf.count} suppliers`
).join('\n')}

Generate 3-5 key insights with:
1. Market trends and opportunities
2. Category performance analysis
3. Pricing recommendations
4. Supplier quality patterns
5. Strategic recommendations for vendors

Format as JSON with: title, insight, impact_level (high/medium/low), category, action_items array`;

    try {
      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      let insights = [];
      
      try {
        const generatedText = geminiResponse.data.candidates[0].content.parts[0].text;
        const jsonMatch = generatedText.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          insights = Array.isArray(parsed) ? parsed : [parsed];
        }
      } catch (parseError) {
        console.log('Using fallback insights due to parsing error:', parseError);
        insights = generateFallbackInsights();
      }
      
      res.json({
        message: 'Market insights generated successfully',
        insights: insights.map((insight, index) => ({
          id: `insight_${Date.now()}_${index}`,
          ...insight,
          generated_at: new Date().toISOString()
        })),
        data_summary: {
          orders_analyzed: orderStats.reduce((sum, stat) => sum + stat.count, 0),
          categories_tracked: orderStats.length,
          suppliers_evaluated: supplierPerformance.reduce((sum, perf) => sum + perf.count, 0)
        }
      });
      
    } catch (aiError) {
      console.error('Gemini API error for insights:', aiError);
      
      const fallbackInsights = generateFallbackInsights();
      
      res.json({
        message: 'Market insights generated successfully (fallback mode)',
        insights: fallbackInsights.map((insight, index) => ({
          id: `fallback_insight_${Date.now()}_${index}`,
          ...insight,
          generated_at: new Date().toISOString()
        })),
        fallback_mode: true
      });
    }

  } catch (error) {
    console.error('Market insights error:', error);
    
    res.status(500).json({
      message: 'Server error generating market insights',
      error: 'MARKET_INSIGHTS_ERROR'
    });
  }
});

// Helper function to generate fallback content
function generateFallbackContent(limit, type) {
  const successStories = [
    {
      title: "How Maria Tripled Her Revenue with Group Buying",
      content: "Maria, a fruit vendor from downtown, discovered the power of group buying through VendorHub. By coordinating with 5 other vendors in her area, she was able to negotiate bulk prices for premium organic fruits. The 40% cost reduction allowed her to offer competitive prices while maintaining healthy margins. Within 3 months, her daily revenue increased from $150 to $450. The key was building trust with other vendors and choosing reliable suppliers with good ratings.",
      type: "success_story",
      tags: ["group-buying", "organic", "revenue-growth", "collaboration"],
      likes: 67,
      comments: 18,
      shares: 12
    },
    {
      title: "5 Essential Tips for New Street Vendors",
      content: "Starting your street vendor business? Here are proven strategies: 1) Location is everything - scout high-traffic areas during different times. 2) Build relationships with reliable suppliers early. 3) Keep detailed financial records from day one. 4) Invest in quality equipment that lasts. 5) Join group buying networks to reduce costs. Remember, consistency beats perfection. Show up every day, provide good service, and your customer base will grow organically.",
      type: "tips",
      tags: ["beginner-tips", "location", "suppliers", "equipment"],
      likes: 43,
      comments: 8,
      shares: 15
    }
  ];
  
  const tips = [
    {
      title: "Smart Inventory Management for Seasonal Items",
      content: "Managing seasonal inventory is crucial for profitability. Track your sales data to identify peak seasons for different products. Start ordering 2-3 weeks before peak season begins. For perishables, use the 'First In, First Out' method religiously. Partner with suppliers who offer flexible quantities during slow seasons. Consider diversifying your product mix to maintain steady income year-round.",
      type: "tips",
      tags: ["inventory", "seasonal", "planning", "profitability"],
      likes: 31,
      comments: 12,
      shares: 7
    }
  ];
  
  const insights = [
    {
      title: "Market Trend: Rising Demand for Healthy Options",
      content: "Data shows a 35% increase in orders for fresh produce and healthy snacks in the past quarter. Vendors who adapted their inventory to include more organic and health-conscious options report 25% higher profit margins. This trend is particularly strong in business districts during lunch hours. Consider partnering with local organic suppliers to capitalize on this growing market.",
      type: "market_insights",
      tags: ["health-trends", "organic", "profit-margins", "market-analysis"],
      likes: 28,
      comments: 6,
      shares: 9
    }
  ];
  
  let content = [];
  
  if (type === 'success_stories' || type === 'all') {
    content = content.concat(successStories);
  }
  if (type === 'tips' || type === 'all') {
    content = content.concat(tips);
  }
  if (type === 'market_insights' || type === 'all') {
    content = content.concat(insights);
  }
  
  return content.slice(0, limit);
}

// Helper function to generate fallback insights
function generateFallbackInsights() {
  return [
    {
      title: "High Demand Categories Identified",
      insight: "Fresh produce and prepared foods show 40% higher order volumes compared to other categories. Suppliers in these categories maintain 4.2+ average ratings.",
      impact_level: "high",
      category: "market_trends",
      action_items: [
        "Consider expanding into fresh produce if not already covered",
        "Partner with highly-rated suppliers in food categories",
        "Monitor inventory levels closely for high-demand items"
      ]
    },
    {
      title: "Group Buying Opportunity",
      insight: "Vendors participating in group buying report 25-35% cost savings on bulk orders. Categories with highest group buying success: beverages, snacks, and non-perishables.",
      impact_level: "high",
      category: "cost_optimization",
      action_items: [
        "Join or initiate group buying for your product categories",
        "Build relationships with nearby vendors for collaboration",
        "Focus on non-perishable items for group orders"
      ]
    },
    {
      title: "Supplier Quality Patterns",
      insight: "Suppliers with 50+ completed orders show 90% on-time delivery rates vs 65% for newer suppliers. Established suppliers justify slightly higher prices with reliability.",
      impact_level: "medium",
      category: "supplier_selection",
      action_items: [
        "Prioritize suppliers with proven track records",
        "Consider reliability over lowest price",
        "Build long-term relationships with top performers"
      ]
    }
  ];
}

module.exports = router;
