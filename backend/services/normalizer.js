
function normalizeHostawayReview(review) {
  // Calculate overall rating if not provided
  let overallRating = review.rating;
  
  if (!overallRating && review.reviewCategory && review.reviewCategory.length > 0) {
    const categoryRatings = review.reviewCategory.map(cat => cat.rating);
    overallRating = categoryRatings.reduce((sum, r) => sum + r, 0) / categoryRatings.length;
  }

  // Determine channel/platform
  const channel = review.channel || review.channelName || 'Airbnb';

  // Normalize review type
  const reviewType = review.type || 'guest-to-host';

  return {
    id: review.id,
    type: reviewType,
    status: review.status || 'published',
    rating: overallRating ? parseFloat(overallRating.toFixed(2)) : null,
    publicReview: review.publicReview || review.privateReview || '',
    reviewCategory: review.reviewCategory || [],
    submittedAt: review.submittedAt,
    guestName: review.guestName || 'Anonymous Guest',
    listingName: review.listingName || 'Unknown Property',
    listingId: review.listingId,
    reservationId: review.reservationId,
    channel: channel,
    // Metadata
    createdAt: review.createdAt || review.submittedAt,
    updatedAt: review.updatedAt || review.submittedAt
  };
}

/**
 * Normalize Google Places review format
 * @param {Object} review - Raw review from Google Places API
 * @returns {Object} Normalized review object
 */
function normalizeGoogleReview(review, placeId) {
  return {
    id: `google_${review.time}`,
    type: 'guest-to-host',
    status: 'published',
    rating: review.rating * 2, // Convert 1-5 to 1-10 scale
    publicReview: review.text || '',
    reviewCategory: [
      { category: 'overall', rating: review.rating * 2 }
    ],
    submittedAt: new Date(review.time * 1000).toISOString(),
    guestName: review.author_name,
    listingName: 'Google Review',
    channel: 'Google',
    // Google-specific fields
    profilePhotoUrl: review.profile_photo_url,
    relativeTimeDescription: review.relative_time_description,
    googlePlaceId: placeId
  };
}

/**
 * Normalize batch of reviews
 * @param {Array} reviews - Array of raw reviews
 * @param {String} source - Source platform (hostaway, google)
 * @returns {Array} Array of normalized reviews
 */
function normalizeReviews(reviews, source = 'hostaway') {
  if (!Array.isArray(reviews)) {
    return [];
  }

  return reviews.map(review => {
    switch (source.toLowerCase()) {
      case 'google':
        return normalizeGoogleReview(review);
      case 'hostaway':
      default:
        return normalizeHostawayReview(review);
    }
  });
}

/**
 * Calculate aggregate statistics from normalized reviews
 * @param {Array} reviews - Array of normalized reviews
 * @returns {Object} Statistics object
 */
function calculateStatistics(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      categoryAverages: {},
      channelBreakdown: {},
      propertyBreakdown: {},
      ratingDistribution: {
        excellent: 0,  // 9.0+
        good: 0,       // 7.5-8.9
        fair: 0,       // 6.0-7.4
        poor: 0        // <6.0
      }
    };
  }

  const categoryAverages = {};
  const channelBreakdown = {};
  const propertyBreakdown = {};
  const ratingDistribution = { excellent: 0, good: 0, fair: 0, poor: 0 };

  reviews.forEach(review => {
    // Category averages
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
    const channel = review.channel || 'Unknown';
    if (!channelBreakdown[channel]) {
      channelBreakdown[channel] = { count: 0, totalRating: 0, reviews: [] };
    }
    channelBreakdown[channel].count += 1;
    channelBreakdown[channel].totalRating += review.rating || 0;
    channelBreakdown[channel].reviews.push(review.id);

    // Property breakdown
    const property = review.listingName || 'Unknown';
    if (!propertyBreakdown[property]) {
      propertyBreakdown[property] = { count: 0, totalRating: 0, reviews: [] };
    }
    propertyBreakdown[property].count += 1;
    propertyBreakdown[property].totalRating += review.rating || 0;
    propertyBreakdown[property].reviews.push(review.id);

    // Rating distribution
    const rating = review.rating || 0;
    if (rating >= 9.0) ratingDistribution.excellent++;
    else if (rating >= 7.5) ratingDistribution.good++;
    else if (rating >= 6.0) ratingDistribution.fair++;
    else ratingDistribution.poor++;
  });

  // Calculate averages
  Object.keys(categoryAverages).forEach(cat => {
    const data = categoryAverages[cat];
    categoryAverages[cat] = parseFloat((data.sum / data.count).toFixed(2));
  });

  Object.keys(channelBreakdown).forEach(channel => {
    const data = channelBreakdown[channel];
    channelBreakdown[channel].averageRating = 
      parseFloat((data.totalRating / data.count).toFixed(2));
    delete channelBreakdown[channel].totalRating;
  });

  Object.keys(propertyBreakdown).forEach(property => {
    const data = propertyBreakdown[property];
    propertyBreakdown[property].averageRating = 
      parseFloat((data.totalRating / data.count).toFixed(2));
    delete propertyBreakdown[property].totalRating;
  });

  const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const averageRating = parseFloat((totalRating / reviews.length).toFixed(2));

  return {
    totalReviews: reviews.length,
    averageRating,
    categoryAverages,
    channelBreakdown,
    propertyBreakdown,
    ratingDistribution
  };
}

module.exports = {
  normalizeHostawayReview,
  normalizeGoogleReview,
  normalizeReviews,
  calculateStatistics
};