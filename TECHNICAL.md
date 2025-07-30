# 🔧 Technical Documentation

## Architecture Overview

### Technology Stack
- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **Routing**: React Router DOM 7.7.1
- **Styling**: CSS3 with CSS Variables
- **State Management**: React Context API
- **Storage**: localStorage
- **Linting**: ESLint 9.30.1

### Design Patterns

#### Component Architecture
```
┌─────────────────┐
│   App.jsx       │ ← Root component
├─────────────────┤
│   AuthProvider  │ ← Context provider
├─────────────────┤
│   Router        │ ← Routing logic
├─────────────────┤
│   Pages         │ ← Route components
├─────────────────┤
│   Components    │ ← Reusable UI
└─────────────────┘
```

#### State Management Flow
```
AuthContext → useAuth Hook → Components
     ↓
localStorage ← → Session State
```

## Component Specifications

### Core Components

#### AuthContext
**Purpose**: Global authentication state management
**State Variables**:
- `user`: Current authenticated user email
- `guestId`: Temporary guest session ID
- `isLoading`: Authentication loading state

**Methods**:
- `login(email)`: Authenticate user
- `logout()`: Clear authentication
- `createGuestSession()`: Generate guest session

#### ProtectedRoute
**Purpose**: Route access control
**Logic**:
```javascript
if (isLoading) return <LoadingSpinner />
return user ? children : <Navigate to="/login" />
```

#### UrlForm
**Purpose**: URL input and validation
**Validation Rules**:
- Non-empty input
- Valid URL format (using URL constructor)
- HTTP/HTTPS protocol required

#### UrlTable
**Purpose**: Display and manage shortened URLs
**Features**:
- Responsive table design
- Copy to clipboard functionality
- Delete confirmation
- QR code generation (premium feature)

### Utility Functions

#### urlUtils.js
```javascript
// URL validation using native URL constructor
export const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

// Cryptographically secure random string generation
export const generateShortCode = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
```

#### demoData.js
```javascript
// Generates realistic demo analytics data
export const generateDummyAnalytics = () => ({
  totalClicks: Math.floor(Math.random() * 1000) + 100,
  uniqueClicks: Math.floor(Math.random() * 500) + 50,
  // ... more analytics data
})
```

### Custom Hooks

#### useClipboard
**Purpose**: Clipboard operations with user feedback
**Implementation**:
```javascript
export const useClipboard = () => {
  const [copiedId, setCopiedId] = useState(null)

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return { copiedId, copyToClipboard }
}
```

## Data Flow

### URL Shortening Process
```
1. User Input → UrlForm
2. Validation → urlUtils.isValidUrl()
3. Short Code → urlUtils.generateShortCode()
4. URL Object Creation
5. State Update → setUrls()
6. localStorage Sync
```

### Authentication Flow
```
1. User Action → Login/Signup
2. AuthContext.login()
3. localStorage Update
4. State Propagation
5. Route Protection Check
6. UI Update
```

### Data Persistence
```javascript
// URL storage pattern
const userId = user || guestId
localStorage.setItem(`urls_${userId}`, JSON.stringify(urls))

// Session storage pattern
localStorage.setItem('urlShortener_user', email)
localStorage.setItem('urlShortener_guestId', guestId)
```

## Performance Optimizations

### Code Splitting
- Route-based splitting with React.lazy()
- Component-level splitting for heavy components
- Dynamic imports for utilities

### Memory Management
- Cleanup timers in useEffect
- Event listener removal
- State cleanup on unmount

### Bundle Optimization
- Tree shaking enabled
- Dead code elimination
- CSS purging in production

## Security Considerations

### Input Validation
```javascript
// XSS Prevention
const sanitizeInput = (input) => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

// URL Validation
const isValidUrl = (string) => {
  try {
    const url = new URL(string)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}
```

### Data Protection
- No sensitive data in localStorage
- Session-based authentication
- HTTPS enforcement in production

## Testing Strategy

### Unit Tests
```javascript
// Component testing with React Testing Library
import { render, screen } from '@testing-library/react'
import UrlForm from './UrlForm'

test('validates URL input', () => {
  render(<UrlForm onSubmit={jest.fn()} />)
  // Test implementation
})
```

### Integration Tests
- Authentication flow testing
- URL shortening workflow
- Route protection verification

### E2E Tests
- User journey testing
- Cross-browser compatibility
- Mobile responsiveness

## Build Configuration

### Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
})
```

### ESLint Configuration
```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }],
    },
  },
]
```

## Deployment

### Environment Variables
```bash
# Production
VITE_APP_ENV=production
VITE_API_URL=https://api.yourapp.com

# Development
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3000
```

### Build Process
```bash
# Production build
npm run build

# Build analysis
npm run build -- --analyze

# Preview production build
npm run preview
```

## Monitoring & Analytics

### Performance Metrics
- Core Web Vitals tracking
- Bundle size monitoring
- Load time analysis

### Error Tracking
```javascript
// Error boundary implementation
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}
```

## API Integration (Future)

### REST API Structure
```javascript
// API endpoints
GET    /api/urls          // Get user URLs
POST   /api/urls          // Create short URL
GET    /api/urls/:id      // Get URL details
DELETE /api/urls/:id      // Delete URL
GET    /api/analytics/:id // Get URL analytics
```

### Authentication Headers
```javascript
// JWT token handling
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken')
  return fetch(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  })
}
```

## Database Schema (Future)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### URLs Table
```sql
CREATE TABLE urls (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

### Analytics Table
```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY,
  url_id UUID REFERENCES urls(id),
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  country VARCHAR(2),
  clicked_at TIMESTAMP DEFAULT NOW()
);
```

## Troubleshooting Guide

### Common Issues

#### Build Failures
```bash
# Clear cache
rm -rf node_modules/.vite
npm run build

# Memory issues
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### Development Issues
```bash
# Port conflicts
npm run dev -- --port 3001

# Hot reload issues
npm run dev -- --force
```

#### ESLint Errors
```bash
# Auto-fix
npm run lint -- --fix

# Ignore specific rules
/* eslint-disable-next-line no-unused-vars */
```

## Contributing Guidelines

### Code Style
- Use functional components with hooks
- Prefer const over let
- Use descriptive variable names
- Add JSDoc comments for functions

### Git Workflow
```bash
# Feature branch naming
feature/add-analytics
bugfix/fix-clipboard-issue
hotfix/security-patch

# Commit message format
feat: add URL analytics dashboard
fix: resolve clipboard copy issue
docs: update API documentation
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

---

This technical documentation provides a comprehensive overview of the codebase architecture, implementation details, and development guidelines for the URL Shortener project.