
# Flex Living Reviews Dashboard

A comprehensive reviews management system for property managers to monitor, approve, and display guest reviews from multiple channels.

## Features

### Manager Dashboard
- 📊 Real-time property performance metrics
- 🎯 Multi-dimensional filtering (property, channel, rating, date)
- ✅ One-click review approval workflow
- 📈 Category-level analytics (cleanliness, communication, location, value)
- 🔍 Trend identification and insights

### Public Display
- ⭐ Clean, modern review showcase
- 🎨 Matches Flex Living brand aesthetic
- 📱 Fully responsive design
- ✓ Only displays manager-approved reviews
- 👤 Guest avatars and verified ratings

### API Integration
- 🔌 Hostaway API integration with normalization
- 🎭 Mock data fallback for sandbox environments
- 📡 RESTful endpoints for all operations
- 📊 Aggregated statistics and analytics
- 🛡️ Error handling and validation

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/EbraamWD/theflexliving.git
cd flex-living-reviews
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API credentials
npm start
```

Backend will run on `http://localhost:3001`

3. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000`

4. **Access the Dashboard**
- Open `http://localhost:3000` in your browser
- Navigate between Dashboard, Reviews Management, and Public View

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Get All Reviews
```http
GET /api/reviews/hostaway
```

**Query Parameters:**
- `listingId` - Filter by property ID
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `status` - Review status (default: 'published')
- `includeStats` - Include statistics (default: 'true')

**Example:**
```bash
curl "http://localhost:3001/api/reviews/hostaway?includeStats=true"
```

#### Get Single Review
```http
GET /api/reviews/hostaway/:id
```

#### Get Properties List
```http
GET /api/reviews/properties
```

#### Approve Reviews
```http
POST /api/reviews/approve
Content-Type: application/json

{
  "reviewIds": [7453, 7454],
  "approved": true
}
```

#### Health Check
```http
GET /health
```

## Project Structure

```
flex-living-reviews/
├── backend/
│   ├── server.js           # Express server & API routes
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── docs/
│   └── DOCUMENTATION.md    # Full technical documentation
└── README.md
```

## Technology Stack

**Frontend:**
- React 18
- Tailwind CSS
- Lucide React (icons)
- Axios

**Backend:**
- Node.js
- Express.js
- Axios
- CORS

## Key Features Explained

### Data Normalization
The API automatically normalizes review data from Hostaway's inconsistent format:
- Calculates overall ratings from category ratings
- Standardizes date formats
- Handles missing fields gracefully
- Ensures consistent channel naming

### Smart Filtering
Managers can filter reviews by:
- Property/Listing
- Channel (Airbnb, Booking.com, Vrbo)
- Minimum rating threshold
- Date range
- Approval status

### Analytics Dashboard
Real-time insights including:
- Average ratings per property
- Category breakdowns (cleanliness, communication, etc.)
- Channel performance comparison
- Approval rate tracking

### Approval Workflow
Simple one-click approval system:
- Approve/unapprove individual reviews
- Visual indicators for approval status
- Only approved reviews appear on public page

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
NODE_ENV=development
```

## Testing

### API Testing with cURL

**Test reviews endpoint:**
```bash
curl http://localhost:3001/api/reviews/hostaway
```

**Test with filters:**
```bash
curl "http://localhost:3001/api/reviews/hostaway?startDate=2024-09-01"
```

**Test approval:**
```bash
curl -X POST http://localhost:3001/api/reviews/approve \
  -H "Content-Type: application/json" \
  -d '{"reviewIds": [7453], "approved": true}'
```

## Deployment

### Backend Deployment (Heroku)

```bash
cd backend
heroku create flex-reviews-api
heroku config:set HOSTAWAY_API_KEY=your_key_here
git push heroku main
```

### Frontend Deployment (Vercel)

```bash
cd frontend
vercel
```

## Google Reviews Integration

Currently documented but not implemented. See full documentation for:
- Technical feasibility analysis
- Implementation roadmap
- Cost estimates
- Sample code snippets

To implement, you'll need:
1. Google Cloud Platform account
2. Places API enabled
3. Service account credentials
4. Each property's Google Place ID

## Troubleshooting

### Backend won't start
- Check Node.js version: `node --version` (should be 16+)
- Verify .env file exists and has correct values
- Check if port 3001 is already in use

### Frontend won't connect to API
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify API URL in frontend code

### No reviews showing
- API is using mock data (expected in sandbox)
- Check browser console for errors
- Verify API response with cURL

### Styling issues
- Run `npm install` in frontend directory
- Clear browser cache
- Check Tailwind CSS configuration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Roadmap

### Phase 1 (Current) ✅
- Hostaway integration
- Manager dashboard
- Public display page
- Review approval workflow

### Phase 2 (Q1 2025)
- Database persistence (PostgreSQL)
- Google Reviews integration
- Advanced analytics & trends
- Email notifications

### Phase 3 (Q2 2025)
- Sentiment analysis
- Automated responses
- Multi-language support
- Mobile app

## License

Proprietary - Flex Living © 2024

## Support

For questions or issues:
- Email: tech@flexliving.com
- Slack: #reviews-dashboard
- Documentation: See `docs/DOCUMENTATION.md`

## Acknowledgments

- Hostaway for API access
- Design inspiration from Airbnb and Booking.com
- Icons by Lucide React

---

**Built with ❤️ for Flex Living property managers**6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}

// ============================================

// backend/.env.example
PORT=3001
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
NODE_ENV=development

# Google Places API (optional - for future integration)
# GOOGLE_PLACES_API_KEY=your_api_key_here

# Database (optional - for future persistence)
# DATABASE_URL=postgresql://user:password@localhost:5432/flex_reviews

// ============================================

// frontend/package.json
{
  "name": "flex-living-reviews-dashboard",
  "version": "1.0.0",
  "description": "Manager Dashboard for Flex Living Reviews",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "axios": "^1.