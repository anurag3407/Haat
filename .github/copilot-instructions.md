<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Street Vendor Supply Management App - Copilot Instructions

This is a full-stack MERN web application for real-time street vendor supply management with the following specifications:

## Tech Stack
- **Frontend**: React with Vite, styled-components, Framer Motion, ChakraUI
- **Backend**: Node.js with Express, MongoDB Atlas, JWT authentication
- **UI Theme**: Cream-based color palette (#FFF4E6, #FFE5B4, #FFDAB9, #F9F6F1, #DCC6A0)
- **APIs**: Gemini AI for intelligent features, Google Maps for geolocation
- **Deployment**: Netlify/Vercel frontend, Render/Railway backend

## Key Features
1. **Group Buying System**: Vendors can start/join group orders for bulk pricing
2. **Civil Score System**: AI-powered creditworthiness scoring for vendors
3. **Supplier Ratings**: Review and rating system for suppliers
4. **Real-time Order Tracking**: Live Google Maps integration for delivery tracking
5. **AI-powered Community Feed**: Gemini-generated success stories and tips

## Code Style Guidelines
- Use modern ES6+ syntax and React hooks
- All animations should use Framer Motion with smooth, delightful transitions
- Follow the cream color palette consistently across all components
- Use styled-components for component styling with the global theme
- Implement proper error handling and loading states
- All data fetching should use React Query (@tanstack/react-query)
- Form validation with react-hook-form
- Responsive design with mobile-first approach

## Architecture
- Frontend organized into: components/, pages/, hooks/, theme.js
- Backend organized into: models/, routes/, controllers/, middleware/, utils/
- All sensitive data managed through .env files
- No dummy/seed data - all data created through user actions
- RESTful API design with proper HTTP status codes

## UI/UX Requirements
- Modern, premium feel with glassmorphism effects
- Smooth animations for all interactions (page transitions, button clicks, modal opens)
- Accessible design with proper color contrast and keyboard navigation
- Loading states, error boundaries, and user feedback through toast notifications
- Custom Google Maps styling with branded pins in cream colors

## Security & Performance
- JWT-based authentication with refresh tokens
- Rate limiting and request validation
- Image optimization and lazy loading
- Code splitting and bundle optimization
- MongoDB indexing for performance

When generating code, prioritize:
1. Clean, readable, and maintainable code
2. Proper TypeScript-like prop validation (using PropTypes if not TypeScript)
3. Component reusability and modularity
4. Performance optimization
5. Accessibility compliance
6. Beautiful, animated user interfaces that feel premium
