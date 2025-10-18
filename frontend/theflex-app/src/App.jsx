import React, { useState, useMemo } from 'react';
import { Star, Filter, TrendingUp, Home, Calendar, MessageSquare, CheckCircle, XCircle, Eye } from 'lucide-react';


// Mock data based on Hostaway API structure
const mockReviews = [
  {
    id: 7453,
    type: "guest-to-host",
    status: "published",
    rating: 9.2,
    publicReview: "Amazing stay! The property was spotless and the location perfect for exploring Shoreditch. Communication was excellent throughout.",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 9 },
      { category: "value", rating: 9 }
    ],
    submittedAt: "2024-10-15 14:30:00",
    guestName: "Sarah Mitchell",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "Airbnb",
    isApproved: true
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
    channel: "Booking.com",
    isApproved: true
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
    channel: "Airbnb",
    isApproved: false
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
    channel: "Airbnb",
    isApproved: true
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
    channel: "Booking.com",
    isApproved: false
  },
  {
    id: 7458,
    type: "guest-to-host",
    status: "published",
    rating: 9.5,
    publicReview: "Wonderful experience! The property exceeded expectations. Highly recommend for business travelers.",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 9 },
      { category: "location", rating: 10 },
      { category: "value", rating: 9 }
    ],
    submittedAt: "2024-09-25 08:30:00",
    guestName: "David Thompson",
    listingName: "Studio W1 B - 8 Mayfair Studios",
    channel: "Airbnb",
    isApproved: true
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
    channel: "Vrbo",
    isApproved: true
  }
];

const FlexReviewsDashboard = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [filterRating, setFilterRating] = useState(0);

  const properties = useMemo(() => {
    const unique = [...new Set(reviews.map(r => r.listingName))];
    return unique.sort();
  }, [reviews]);

  const channels = useMemo(() => {
    return [...new Set(reviews.map(r => r.channel))].sort();
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let filtered = reviews.filter(review => {
      if (selectedProperty !== 'all' && review.listingName !== selectedProperty) return false;
      if (selectedChannel !== 'all' && review.channel !== selectedChannel) return false;
      if (filterRating > 0 && review.rating < filterRating) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });
  }, [reviews, selectedProperty, selectedChannel, sortBy, filterRating]);

  const propertyStats = useMemo(() => {
    const stats = {};
    reviews.forEach(review => {
      if (!stats[review.listingName]) {
        stats[review.listingName] = {
          total: 0,
          avgRating: 0,
          approved: 0,
          ratings: [],
          categories: {}
        };
      }
      stats[review.listingName].total++;
      stats[review.listingName].ratings.push(review.rating);
      if (review.isApproved) stats[review.listingName].approved++;

      review.reviewCategory.forEach(cat => {
        if (!stats[review.listingName].categories[cat.category]) {
          stats[review.listingName].categories[cat.category] = [];
        }
        stats[review.listingName].categories[cat.category].push(cat.rating);
      });
    });

    Object.keys(stats).forEach(prop => {
      const ratings = stats[prop].ratings;
      stats[prop].avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);

      Object.keys(stats[prop].categories).forEach(cat => {
        const catRatings = stats[prop].categories[cat];
        stats[prop].categories[cat] = (catRatings.reduce((a, b) => a + b, 0) / catRatings.length).toFixed(1);
      });
    });

    return stats;
  }, [reviews]);

  const toggleApproval = (id) => {
    setReviews(reviews.map(r =>
      r.id === id ? { ...r, isApproved: !r.isApproved } : r
    ));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderStars = (rating) => {
    const stars = Math.round(rating / 2);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 9) return 'text-green-600 bg-green-50';
    if (rating >= 7.5) return 'text-blue-600 bg-blue-50';
    if (rating >= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Reviews</span>
            <MessageSquare size={18} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold">{reviews.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Avg Rating</span>
            <TrendingUp size={18} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold">
            {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Properties</span>
            <Home size={18} className="text-purple-500" />
          </div>
          <div className="text-2xl font-bold">{properties.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Approved</span>
            <CheckCircle size={18} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold">
            {reviews.filter(r => r.isApproved).length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Property Performance</h3>
        <div className="space-y-4">
          {properties.map(prop => {
            const stats = propertyStats[prop];
            return (
              <div key={prop} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{prop}</h4>
                    <p className="text-sm text-gray-500">{stats.total} reviews • {stats.approved} approved</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRatingColor(parseFloat(stats.avgRating))}`}>
                      {stats.avgRating}
                    </span>
                    {renderStars(parseFloat(stats.avgRating))}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {Object.entries(stats.categories).map(([cat, rating]) => (
                    <div key={cat} className="text-xs">
                      <div className="text-gray-500 capitalize mb-1">{cat.replace(/_/g, ' ')}</div>
                      <div className="font-semibold">{rating}/10</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const ReviewsManagementView = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Properties</option>
              {properties.map(prop => (
                <option key={prop} value={prop}>{prop}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Channels</option>
              {channels.map(ch => (
                <option key={ch} value={ch}>{ch}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="0">All Ratings</option>
              <option value="9">9.0+</option>
              <option value="8">8.0+</option>
              <option value="7">7.0+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="date">Most Recent</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredReviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRatingColor(review.rating)}`}>
                    {review.rating}
                  </span>
                  {renderStars(review.rating)}
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {review.channel}
                  </span>
                  {review.isApproved && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1">
                      <CheckCircle size={12} />
                      Approved
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900">{review.listingName}</h4>
                <p className="text-sm text-gray-500">
                  {review.guestName} • {formatDate(review.submittedAt)}
                </p>
              </div>
              <button
                onClick={() => toggleApproval(review.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${review.isApproved
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
              >
                {review.isApproved ? 'Unapprove' : 'Approve'}
              </button>
            </div>
            <p className="text-gray-700 mb-3">{review.publicReview}</p>
            <div className="flex flex-wrap gap-3">
              {review.reviewCategory.map(cat => (
                <div key={cat.category} className="text-xs bg-gray-50 px-3 py-1 rounded">
                  <span className="text-gray-600 capitalize">{cat.category.replace(/_/g, ' ')}: </span>
                  <span className="font-semibold">{cat.rating}/10</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PublicDisplayView = () => {
    const approvedReviews = reviews.filter(r => r.isApproved);
    const avgRating = approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
      : 0;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-white rounded-lg p-8 mb-8" style={{ backgroundColor: '#284e4c' }}>
          <h1 className="text-3xl font-bold mb-2">Flex Living Properties</h1>
          <p className="text-blue-100">Modern living spaces in London's best locations</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{avgRating}</div>
                <div className="text-sm text-gray-500">{approvedReviews.length} reviews</div>
              </div>
              {renderStars(parseFloat(avgRating))}
            </div>
          </div>

          <div className="space-y-6">
            {approvedReviews.map(review => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                    {review.guestName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.guestName}</h4>
                        <p className="text-sm text-gray-500">{formatDate(review.submittedAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-sm font-semibold text-gray-700">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.publicReview}</p>
                    <div className="mt-3 text-sm text-gray-500">
                      Stayed at: {review.listingName}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen " style={{ backgroundColor: 'rgb(255, 253, 246)'}}>
      <header className="border-b border-gray-700 sticky top-0 z-10" style={{ backgroundColor: '#284e4c' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Home className="text-white" size={28} />
              <h1 className="text-xl font-bold text-white">the flex</h1>
            </div>
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-white hover:bg-gray-100'
                  }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('reviews')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === 'reviews'
                    ? 'bg-blue-600 text-white'
                    : 'text-white hover:bg-gray-100'
                  }`}
              >
                Manage Reviews
              </button>
              <button
                onClick={() => setActiveView('public')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeView === 'public'
                    ? 'bg-blue-600 text-white'
                    : 'text-white hover:bg-gray-100'
                  }`}
              >
                <Eye size={16} />
                Public View
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'reviews' && <ReviewsManagementView />}
        {activeView === 'public' && <PublicDisplayView />}
      </main>
    </div>
  );
};

export default FlexReviewsDashboard;