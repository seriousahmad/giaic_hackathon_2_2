# Quickstart Guide: Frontend for Phase II-Todo Hackathon

## Overview
This guide provides a quick start for developing the Next.js frontend for the Todo app Phase II. Follow these steps to set up your development environment and start building.

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- A code editor (VS Code recommended)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Navigate to Frontend Directory
```bash
cd frontend
```

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Set Up Environment Variables
Create a `.env.local` file in the `frontend` directory with the following:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Project Structure
```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── dashboard/         # Protected dashboard
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   └── todo/             # Todo-specific components
├── lib/                  # Utility functions and API client
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## Key Development Commands

### Development
```bash
npm run dev          # Start development server
```

### Building
```bash
npm run build        # Build for production
npm run start        # Start production server
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

### Linting & Formatting
```bash
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

## API Integration

### Authentication API
The frontend integrates with the backend authentication API:
- Sign up: `POST /api/auth/signup`
- Sign in: `POST /api/auth/signin`
- Logout: `POST /api/auth/logout`

### Todo API
The frontend communicates with the Todo API:
- Get todos: `GET /api/todos`
- Create todo: `POST /api/todos`
- Update todo: `PUT /api/todos/{id}`
- Delete todo: `DELETE /api/todos/{id}`

## Component Development

### Creating New Components
1. Add new components to the appropriate subdirectory in `components/`
2. Follow the existing naming convention (e.g., `TodoList.tsx`)
3. Use TypeScript interfaces for props
4. Write unit tests for new components

### Using UI Components
The project uses a set of base UI components in `components/ui/`:
- Buttons: `Button` component
- Forms: `Input`, `Textarea`, etc.
- Modals: `Modal` component
- Feedback: `Toast` component

## Authentication Flow

1. Unauthenticated users are redirected to `/sign-in`
2. Sign-in/sign-up forms use Better Auth
3. Protected routes check for valid JWT tokens
4. API calls automatically include JWT tokens in headers

## Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the design system defined in `globals.css`
- Use responsive design principles
- Maintain consistent spacing and typography

## Testing Strategy

### Unit Tests
- Test individual components in isolation
- Use React Testing Library
- Focus on user interactions and behaviors

### Integration Tests
- Test component interactions
- Verify API integration
- Test form submissions and state changes

### End-to-End Tests
- Test complete user flows
- Use Playwright for browser automation
- Cover all user stories from the specification

## Environment-Specific Configuration

### Development
- API calls target local backend
- Hot reloading enabled
- Detailed error messages

### Production
- Optimized builds
- Error logging
- Performance monitoring

## Troubleshooting

### Common Issues
1. **API calls failing**: Check that backend server is running
2. **Authentication not working**: Verify environment variables are set correctly
3. **Styling issues**: Check Tailwind CSS configuration
4. **Build errors**: Ensure all dependencies are installed

### Getting Help
- Check the project documentation
- Review the feature specification
- Consult the API contracts in `contracts/`