# Contributing to Haat

Thank you for your interest in contributing to Haat! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- MongoDB Atlas account
- Google API Keys (Maps & Gemini AI)

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/anurag3407/Haat.git
   cd Haat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Frontend
   cp .env.example .env
   # Edit .env with your actual API keys
   
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your actual values
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

## Project Structure

```
haat/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Route-based page components
│   ├── contexts/          # React Context providers
│   ├── services/          # API and data services
│   ├── theme/             # Design system and theming
│   └── assets/            # Static images and resources
├── backend/               # Node.js Express server
│   ├── models/            # MongoDB Mongoose schemas
│   ├── routes/            # API route handlers
│   ├── middleware/        # Authentication & validation
│   └── utils/             # Helper functions
├── public/                # Static public assets
└── docs/                  # Documentation files
```

## Coding Standards

### Code Style
- Use modern ES6+ syntax and React hooks
- Follow the existing code style and conventions
- Use meaningful variable and function names
- Write clean, readable, and maintainable code

### Component Guidelines
- Use functional components with hooks
- Implement proper PropTypes or TypeScript
- Follow the cream color palette consistently
- Use styled-components for component styling
- Implement proper error handling and loading states

### API Guidelines
- Follow RESTful API design principles
- Use proper HTTP status codes
- Implement comprehensive error handling
- Add proper request validation
- Document API endpoints

## Development Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages
Use conventional commits format:
```
type(scope): description

feat(auth): add JWT refresh token functionality
fix(dashboard): resolve real-time data loading issue
docs(readme): update installation instructions
```

### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes following the coding standards
3. Test your changes thoroughly
4. Update documentation if needed
5. Submit a pull request with a clear description

## Testing

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend && npm test

# E2E tests
npm run test:e2e
```

### Writing Tests
- Write unit tests for components and functions
- Include integration tests for API endpoints
- Add E2E tests for critical user journeys
- Maintain good test coverage

## Design Guidelines

### UI/UX Principles
- Mobile-first responsive design
- Accessible design with proper ARIA labels
- Consistent use of the cream color palette
- Smooth animations using Framer Motion
- Loading states and error boundaries

### Color Palette
- Primary: `#FFF4E6` (Cream White)
- Secondary: `#FFE5B4` (Peach Cream)
- Tertiary: `#FFDAB9` (Light Peach)
- Background: `#F9F6F1` (Off White)
- Accent: `#DCC6A0` (Warm Beige)

## API Documentation

### Authentication
All API endpoints except registration and login require JWT authentication:
```javascript
headers: {
  'Authorization': 'Bearer <jwt_token>'
}
```

### Error Handling
API responses follow this format:
```javascript
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Deployment

### Environment Setup
- Ensure all environment variables are properly configured
- Test in development before deploying to production
- Use secure secrets for JWT and API keys

### Production Deployment
- Frontend: Netlify/Vercel
- Backend: Railway/Render
- Database: MongoDB Atlas

## Getting Help

### Resources
- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Styled Components](https://styled-components.com/docs)

### Community
- Create GitHub Issues for bugs and feature requests
- Join discussions in GitHub Discussions
- Follow the code of conduct

## Code of Conduct

### Our Standards
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a positive environment

### Reporting Issues
Report any violations to the project maintainers through:
- GitHub Issues
- Direct email to maintainers

Thank you for contributing to Haat! 🚀
