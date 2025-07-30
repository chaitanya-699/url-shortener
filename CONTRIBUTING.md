# 🤝 Contributing to URL Shortener

Thank you for your interest in contributing to the URL Shortener project! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

### Our Pledge
We are committed to making participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener

# Add upstream remote
git remote add upstream https://github.com/originalowner/url-shortener.git
```

## 🛠️ Development Setup

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
# VITE_APP_TITLE=URL Shortener
# VITE_API_URL=http://localhost:3000
```

### VS Code Setup
Recommended extensions:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ComponentName/
│   │   ├── ComponentName.jsx
│   │   └── ComponentName.css
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── context/            # React Context providers
└── assets/             # Static assets
```

### Component Guidelines
- Each component should have its own directory
- Include both `.jsx` and `.css` files
- Use PascalCase for component names
- Keep components focused and single-purpose

## 🎨 Coding Standards

### JavaScript/React
```javascript
// Use functional components with hooks
const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue)
  
  // Use descriptive variable names
  const handleButtonClick = () => {
    // Implementation
  }
  
  return (
    <div className="my-component">
      {/* JSX content */}
    </div>
  )
}

export default MyComponent
```

### CSS
```css
/* Use BEM-like naming convention */
.component-name {
  /* Component styles */
}

.component-name__element {
  /* Element styles */
}

.component-name--modifier {
  /* Modifier styles */
}

/* Use CSS custom properties for theming */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}
```

### File Naming
- Components: `PascalCase.jsx`
- Utilities: `camelCase.js`
- Hooks: `useCamelCase.js`
- CSS: `PascalCase.css` or `camelCase.css`

### Code Style Rules
- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects/arrays
- Use semicolons
- Max line length: 100 characters

## 📝 Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(auth): add social login functionality

Add Google and GitHub OAuth integration
- Implement OAuth flow
- Add social login buttons
- Update authentication context

Closes #123

fix(clipboard): resolve copy functionality on mobile

The clipboard API was not working on mobile devices
due to security restrictions. Added fallback method.

Fixes #456

docs(readme): update installation instructions

Add Node.js version requirement and troubleshooting section
```

### Branch Naming
```bash
# Feature branches
feature/add-analytics-dashboard
feature/implement-qr-codes

# Bug fix branches
bugfix/fix-mobile-navigation
bugfix/resolve-clipboard-issue

# Hotfix branches
hotfix/security-patch
hotfix/critical-bug-fix
```

## 🔄 Pull Request Process

### Before Submitting
1. **Update your fork**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow coding standards
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

### Pull Request Template
```markdown
## 📋 Description
Brief description of the changes made.

## 🔧 Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## 🧪 Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (if applicable)

## 📱 Mobile Testing
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive design verified

## 📸 Screenshots
If applicable, add screenshots to help explain your changes.

## ✅ Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## 🔗 Related Issues
Closes #(issue number)
```

### Review Process
1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: Manual testing by reviewers
4. **Documentation**: Ensure docs are updated
5. **Merge**: Squash and merge preferred

## 🐛 Issue Reporting

### Bug Reports
Use the bug report template:

```markdown
## 🐛 Bug Description
A clear and concise description of what the bug is.

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## ✅ Expected Behavior
A clear description of what you expected to happen.

## 📸 Screenshots
If applicable, add screenshots to help explain your problem.

## 🖥️ Environment
- OS: [e.g. iOS, Windows, macOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
- Device: [e.g. iPhone6, Desktop]

## 📋 Additional Context
Add any other context about the problem here.
```

### Issue Labels
- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority-high`: High priority issue
- `priority-low`: Low priority issue

## 💡 Feature Requests

### Feature Request Template
```markdown
## 🚀 Feature Request
**Is your feature request related to a problem? Please describe.**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

**Implementation Ideas**
If you have ideas about how to implement this feature, please share them.
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests
```javascript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react'
import UrlForm from './UrlForm'

describe('UrlForm', () => {
  test('validates URL input', () => {
    const mockSubmit = jest.fn()
    render(<UrlForm onSubmit={mockSubmit} />)
    
    const input = screen.getByPlaceholderText(/enter your long url/i)
    const button = screen.getByRole('button', { name: /shorten url/i })
    
    fireEvent.change(input, { target: { value: 'invalid-url' } })
    fireEvent.click(button)
    
    expect(mockSubmit).not.toHaveBeenCalled()
  })
})
```

### Test Guidelines
- Write tests for new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test both happy path and edge cases
- Mock external dependencies

## 📚 Documentation

### Documentation Types
- **README.md**: Project overview and setup
- **TECHNICAL.md**: Technical implementation details
- **API.md**: API documentation (when applicable)
- **Component docs**: JSDoc comments in components

### Writing Guidelines
- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep documentation up to date
- Use proper markdown formatting

### JSDoc Comments
```javascript
/**
 * Validates if a string is a valid URL
 * @param {string} string - The string to validate
 * @returns {boolean} - True if valid URL, false otherwise
 * @example
 * const isValid = isValidUrl('https://example.com')
 * console.log(isValid) // true
 */
export const isValidUrl = (string) => {
  // Implementation
}
```

## 🏆 Recognition

### Contributors
All contributors will be recognized in:
- README.md contributors section
- CHANGELOG.md for their contributions
- GitHub contributors page

### Contribution Types
We recognize all types of contributions:
- Code contributions
- Bug reports
- Feature suggestions
- Documentation improvements
- Design contributions
- Testing and QA
- Community support

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: maintainer@example.com (for sensitive issues)

### Response Times
- **Bug reports**: Within 48 hours
- **Feature requests**: Within 1 week
- **Pull requests**: Within 72 hours
- **Questions**: Within 24 hours

## 🎯 Development Roadmap

### Current Focus
- Mobile optimization
- Performance improvements
- Accessibility enhancements
- Test coverage increase

### Future Plans
- API integration
- Advanced analytics
- Team collaboration features
- Enterprise features

## 📋 Checklist for New Contributors

- [ ] Read and understand the Code of Conduct
- [ ] Set up development environment
- [ ] Run the project locally
- [ ] Read through existing code
- [ ] Look for "good first issue" labels
- [ ] Join community discussions
- [ ] Make your first contribution!

---

## 🙏 Thank You

Thank you for contributing to the URL Shortener project! Your contributions help make this project better for everyone.

**Happy coding! 🚀**

---

*For technical details, see [TECHNICAL.md](TECHNICAL.md)*
*For project overview, see [README.md](README.md)*