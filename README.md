# VendorHub - Street Vendor Supply Management Platform

A beautiful, full-stack MERN web application for revolutionizing street vendor supply chains through group buying, AI-powered civil scoring, and real-time tracking.

## 🎨 Design Features

- **Beautiful Cream Theme**: Modern, accessible color palette (#FFF4E6, #FFE5B4, #FFDAB9, #F9F6F1, #DCC6A0)
- **Smooth Animations**: Framer Motion powered micro-animations and page transitions
- **Responsive Design**: Mobile-first, accessible design with glassmorphism effects
- **Production Ready**: Optimized for Netlify/Vercel deployment

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Styled Components** for beautiful, themed styling
- **Framer Motion** for smooth animations
- **Chakra UI** for accessible base components
- **React Query** for efficient data fetching
- **React Router** for client-side routing
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** for database
- **JWT** authentication with refresh tokens
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Rate limiting** and security middleware

### APIs & Services
- **Google Maps API** for location services and tracking
- **Gemini AI API** for intelligent insights and scoring
- **Real-time updates** with React Query

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Google Maps API key
- Gemini AI API key

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd vendor-hub

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Configuration

#### Frontend (.env)
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_APP_NAME=VendorHub
VITE_NODE_ENV=development
VITE_ENABLE_DEMO_MODE=true
```

#### Backend (backend/.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vendor-supply-management
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=development
PORT=5000
```

### 3. API Keys Setup

#### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API, Places API, and Geocoding API
3. Create API key and add to both frontend and backend `.env` files

#### Gemini AI API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key and add to backend `.env` file

#### MongoDB Atlas
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create cluster and get connection string
3. Add to backend `.env` file

### 4. Development

#### Start Backend Server
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

#### Start Frontend Development Server
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🎯 Core Features

### 👥 User Management
- **Dual Role System**: Vendors and Suppliers
- **JWT Authentication**: Secure login with refresh tokens
- **Profile Management**: Business info, location, preferences

### 🛒 Group Buying
- **Create/Join Orders**: Collaborative purchasing power
- **Real-time Bidding**: Suppliers compete for orders
- **Progress Tracking**: Live participant counts and deadlines

### ⭐ Civil Score System
- **AI-Powered Scoring**: Creditworthiness based on behavior
- **Score History**: Track improvements over time
- **Gemini Insights**: AI explanations for score changes

### 📍 Real-time Tracking
- **Google Maps Integration**: Live order tracking
- **Delivery Routes**: Optimized paths with ETA
- **Status Updates**: Real-time order progress

### 🏆 Rating System
- **Supplier Reviews**: Community-driven ratings
- **Detailed Metrics**: Quality, timeliness, communication
- **Verified Reviews**: Tied to actual orders

### 🤖 AI Features
- **Smart Recommendations**: Gemini-powered suggestions
- **Community Insights**: Success stories and tips
- **Business Intelligence**: Data-driven recommendations

## 📱 Pages & Features

### Public Pages
- **Home**: Animated hero, features showcase, how-it-works
- **Login/Register**: Beautiful forms with validation

### Vendor Dashboard
- **Dashboard**: Order overview, civil score, quick actions
- **New Order**: Create individual or group orders
- **Group Buy**: Join existing group purchases
- **Civil Score**: AI-powered creditworthiness tracking
- **Supplier Ratings**: Review and rate suppliers
- **Order Tracking**: Real-time delivery tracking

### Supplier Dashboard
- **Dashboard**: Bid management, earnings overview
- **Orders**: Available orders and bidding interface
- **My Ratings**: Performance metrics and reviews

### Shared Features
- **Community Feed**: Success stories and AI insights
- **Profile Management**: Business information and settings
- **Real-time Notifications**: Toast alerts for important events

## 🎨 Theme & Styling

### Color Palette
```css
--cream-background: #FFF4E6;
--cream-primary: #FFE5B4;
--cream-secondary: #FFDAB9;
--cream-accent: #DCC6A0;
--cream-surface: #F9F6F1;
--text-primary: #352E2E;
```

### Key Features
- **Glassmorphism Effects**: Blurred backgrounds with transparency
- **Smooth Animations**: Page transitions, hover effects, loading states
- **Responsive Design**: Mobile-first with breakpoint system
- **Accessibility**: WCAG compliant colors and keyboard navigation

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
```

### Backend (Render/Railway)
Set environment variables and deploy the `backend` folder.

### Environment Variables (Production)
Update all `.env` files with production URLs and secure secrets.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile

### Order Management
- `GET /api/orders` - Get orders (role-based filtering)
- `POST /api/orders` - Create new order
- `POST /api/orders/:id/join` - Join group buy
- `POST /api/orders/:id/bid` - Place supplier bid
- `PUT /api/orders/:id/status` - Update order status

### Reviews & Ratings
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/stats/:userId` - Get user rating stats

## 🔧 Development Tools

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend
```bash
npm start            # Start production server
npm run dev          # Start development server with nodemon
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@vendorhub.com or join our community Discord.

---

**Made with ❤️ and ☕ for the street vendor community**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
