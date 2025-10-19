import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const frontendPath = path.join(__dirname, "../frontend/dist")
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));
app.get((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
// Hostaway API Configuration
const HOSTAWAY_CONFIG = {
  accountId: '61148',
  apiKey: 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152',
  baseUrl: 'https://api.hostaway.com/v1'
};

// Mock reviews data (since sandbox has no reviews)
const MOCK_REVIEWS = [
  {
    id: 7453,
    type: "guest-to-host",
    status: "published",
    rating: 9.2,
    publicReview: "Amazing stay! The property was spotless and the location perfect for exploring Shoreditch. Communication was excellent throughout.",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 9 },
      { category: "location", rating: 10 },
      { category: "value", rating: 9 }
    ],
    submittedAt: "2024-09-25 08:30:00",
    guestName: "David Thompson",
    listingName: "Studio W1 B - 8 Mayfair Studios",
    channel: "Airbnb"
  },
  {
    id: 7459,
    type: "guest-to-host",
    status: "published",
    rating: 8.8,
    publicReview: "Lovely stay! The place was clean and comfortable. Perfect for our weekend getaway.",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "communication", rating: 9 },
      { category: "location", rating: 9 },
      { category: "value", rating: 8 }
    ],
    submittedAt: "2024-09-20 19:45:00",
    guestName: "Anna Kowalski",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "Vrbo"
  },
  {
    id: 7453,
    type: "guest-to-host",
    status: "published",
    rating: 9.5,
    publicReview: "Exceptional stay! The apartment exceeded all expectations. Beautiful views and perfect location.",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 9 },
      { category: "value", rating: 9 }
    ],
    submittedAt: "2024-10-15 14:30:00",
    guestName: "Sarah Mitchell",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "Airbnb"
  },
  {
    id: 7454,
    type: "guest-to-host",
    status: "published",
    rating: 8.5,
    publicReview: "Great apartment in a vibrant area. Minor issue with heating but host resolved it quickly. Would recommend!",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 10 },
      { category: "value", rating: 7 }
    ],
    submittedAt: "2024-10-12 09:15:00",
    guestName: "James Chen",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "Booking.com"
  },
  {
    id: 7455,
    type: "guest-to-host",
    status: "published",
    rating: 7.8,
    publicReview: "Decent place but could use some maintenance. The view was nice and check-in was smooth.",
    reviewCategory: [
      { category: "cleanliness", rating: 7 },
      { category: "communication", rating: 9 },
      { category: "location", rating: 8 },
      { category: "value", rating: 8 }
    ],
    submittedAt: "2024-10-08 16:45:00",
    guestName: "Emily Rodriguez",
    listingName: "1B E2 C - 15 Brick Lane Lofts",
    channel: "Airbnb"
  },
  {
    id: 7456,
    type: "guest-to-host",
    status: "published",
    rating: 9.8,
    publicReview: "Absolutely perfect! Everything was exactly as described. The apartment is modern, clean, and well-equipped. Host was super responsive.",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 10 },
      { category: "value", rating: 9 }
    ],
    submittedAt: "2024-10-05 11:20:00",
    guestName: "Michael O'Brien",
    listingName: "Studio W1 B - 8 Mayfair Studios",
    channel: "Airbnb"
  },
  {
    id: 7457,
    type: "guest-to-host",
    status: "published",
    rating: 6.5,
    publicReview: "Location was good but apartment needs updating. WiFi was unstable during our stay.",
    reviewCategory: [
      { category: "cleanliness", rating: 7 },
      { category: "communication", rating: 8 },
      { category: "location", rating: 9 },
      { category: "value", rating: 5 }
    ],
    submittedAt: "2024-09-28 13:10:00",
    guestName: "Lisa Wang",
    listingName: "1B E2 C - 15 Brick Lane Lofts",
    channel: "Booking.com"
  }
];

/**
 * Normalize Hostaway review data to a consistent format
 * Handles both guest-to-host and host-to-guest reviews
 */
function normalizeHostawayReview(review) {
  // Calculate overall rating from category ratings if not provided
  let overallRating = review.rating;
  
  if (!overallRating && review.reviewCategory && review.reviewCategory.length > 0) {
    const categoryRatings = review.reviewCategory.map(cat => cat.rating);
    overallRating = categoryRatings.reduce((sum, r) => sum + r, 0) / categoryRatings.length;
  }

  // Extract channel from listing metadata or default
  const channel = review.channel || review.channelName || 'Airbnb';

  return {
    id: review.id,
    type: review.type,
    status: review.status,
    rating: overallRating,
    publicReview: review.publicReview || review.privateReview || '',
    reviewCategory: review.reviewCategory || [],
    submittedAt: review.submittedAt,
    guestName: review.guestName || 'Anonymous',
    listingName: review.listingName || 'Unknown Property',
    channel: channel,
    // Additional metadata
    reservationId: review.reservationId,
    listingId: review.listingId
  };
}

/**
 * Calculate aggregate statistics for reviews
 */
function calculateReviewStats(reviews) {
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      categoryAverages: {},
      channelBreakdown: {},
      propertyBreakdown: {}
    };
  }

  const categoryAverages = {};
  const channelBreakdown = {};
  const propertyBreakdown = {};

  reviews.forEach(review => {
    // Calculate category averages
    if (review.reviewCategory) {
      review.reviewCategory.forEach(cat => {
        if (!categoryAverages[cat.category]) {
          categoryAverages[cat.category] = { sum: 0, count: 0 };
        }
        categoryAverages[cat.category].sum += cat.rating;
        categoryAverages[cat.category].count += 1;
      });
    }

    // Channel breakdown
    if (!channelBreakdown[review.channel]) {
      channelBreakdown[review.channel] = { count: 0, totalRating: 0 };
    }
    channelBreakdown[review.channel].count += 1;
    channelBreakdown[review.channel].totalRating += review.rating || 0;

    // Property breakdown
    if (!propertyBreakdown[review.listingName]) {
      propertyBreakdown[review.listingName] = { count: 0, totalRating: 0 };
    }
    propertyBreakdown[review.listingName].count += 1;
    propertyBreakdown[review.listingName].totalRating += review.rating || 0;
  });

  // Calculate averages
  Object.keys(categoryAverages).forEach(cat => {
    categoryAverages[cat] = 
      categoryAverages[cat].sum / categoryAverages[cat].count;
  });

  Object.keys(channelBreakdown).forEach(channel => {
    channelBreakdown[channel].averageRating = 
      channelBreakdown[channel].totalRating / channelBreakdown[channel].count;
  });

  Object.keys(propertyBreakdown).forEach(property => {
    propertyBreakdown[property].averageRating = 
      propertyBreakdown[property].totalRating / propertyBreakdown[property].count;
  });

  const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const averageRating = totalRating / reviews.length;

  return {
    totalReviews: reviews.length,
    averageRating: parseFloat(averageRating.toFixed(2)),
    categoryAverages,
    channelBreakdown,
    propertyBreakdown
  };
}

/**
 * GET /api/reviews/hostaway
 * Fetches and normalizes reviews from Hostaway API
 * Falls back to mock data if API returns no results
 */
app.get('/api/reviews/hostaway', async (req, res) => {
  try {
    const { 
      listingId, 
      startDate, 
      endDate, 
      status = 'published',
      includeStats = 'true'
    } = req.query;

    // Build Hostaway API request
    const headers = {
      'Authorization': `Bearer ${HOSTAWAY_CONFIG.apiKey}`,
      'Content-Type': 'application/json'
    };

    const params = {
      accountId: HOSTAWAY_CONFIG.accountId
    };

    if (listingId) params.listingId = listingId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (status) params.status = status;

    let reviews = [];
    let usingMockData = false;

    try {
      // Attempt to fetch from Hostaway API
      const response = await axios.get(
        `${HOSTAWAY_CONFIG.baseUrl}/reviews`,
        { headers, params, timeout: 10000 }
      );

      if (response.data.status === 'success' && response.data.result) {
        reviews = response.data.result;
      }
    } catch (apiError) {
      console.warn('Hostaway API error, using mock data:', apiError.message);
      usingMockData = true;
    }

    // Use mock data if API returns empty or fails (sandbox environment)
    if (reviews.length === 0) {
      reviews = MOCK_REVIEWS;
      usingMockData = true;
    }

    // Normalize all reviews
    const normalizedReviews = reviews.map(normalizeHostawayReview);

    // Apply filters
    let filteredReviews = normalizedReviews;

    if (listingId) {
      filteredReviews = filteredReviews.filter(
        r => r.listingId === parseInt(listingId)
      );
    }

    if (startDate) {
      filteredReviews = filteredReviews.filter(
        r => new Date(r.submittedAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredReviews = filteredReviews.filter(
        r => new Date(r.submittedAt) <= new Date(endDate)
      );
    }

    // Calculate statistics if requested
    const stats = includeStats === 'true' 
      ? calculateReviewStats(filteredReviews)
      : null;

    res.json({
      success: true,
      meta: {
        usingMockData,
        count: filteredReviews.length,
        timestamp: new Date().toISOString()
      },
      data: filteredReviews,
      stats
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      message: error.message
    });
  }
});

/**
 * GET /api/reviews/hostaway/:id
 * Fetch a single review by ID
 */
app.get('/api/reviews/hostaway/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In production, this would fetch from Hostaway API
    // For now, search in mock data
    const review = MOCK_REVIEWS.find(r => r.id === parseInt(id));

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: normalizeHostawayReview(review)
    });

  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch review',
      message: error.message
    });
  }
});

/**
 * GET /api/reviews/properties
 * Get list of all properties with review counts
 */
app.get('/api/reviews/properties', async (req, res) => {
  try {
    const propertyMap = {};

    MOCK_REVIEWS.forEach(review => {
      const name = review.listingName;
      if (!propertyMap[name]) {
        propertyMap[name] = {
          name,
          reviewCount: 0,
          totalRating: 0,
          categories: {}
        };
      }
      
      propertyMap[name].reviewCount += 1;
      propertyMap[name].totalRating += review.rating || 0;

      if (review.reviewCategory) {
        review.reviewCategory.forEach(cat => {
          if (!propertyMap[name].categories[cat.category]) {
            propertyMap[name].categories[cat.category] = { sum: 0, count: 0 };
          }
          propertyMap[name].categories[cat.category].sum += cat.rating;
          propertyMap[name].categories[cat.category].count += 1;
        });
      }
    });

    // Calculate averages
    const properties = Object.values(propertyMap).map(prop => ({
      name: prop.name,
      reviewCount: prop.reviewCount,
      averageRating: parseFloat((prop.totalRating / prop.reviewCount).toFixed(2)),
      categoryAverages: Object.keys(prop.categories).reduce((acc, cat) => {
        acc[cat] = parseFloat(
          (prop.categories[cat].sum / prop.categories[cat].count).toFixed(2)
        );
        return acc;
      }, {})
    }));

    res.json({
      success: true,
      data: properties.sort((a, b) => b.averageRating - a.averageRating)
    });

  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties',
      message: error.message
    });
  }
});

/**
 * POST /api/reviews/approve
 * Approve/unapprove reviews for public display
 * In production, this would store approval status in database
 */
app.post('/api/reviews/approve', async (req, res) => {
  try {
    const { reviewIds, approved } = req.body;

    if (!Array.isArray(reviewIds)) {
      return res.status(400).json({
        success: false,
        error: 'reviewIds must be an array'
      });
    }

    res.json({
      success: true,
      message: `${reviewIds.length} reviews ${approved ? 'approved' : 'unapproved'}`,
      data: {
        reviewIds,
        approved,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error updating approval status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update approval status',
      message: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Flex Living Reviews API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Flex Living Reviews API running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});