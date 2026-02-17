# Pets Adoption Platform

A modern React application for pet adoption, built with TypeScript and feature-based architecture.

## Quick Start

```bash
npm install
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Project Structure

```
src/
├── app/                    # App configuration
│   ├── App.tsx            # Root component
│   ├── router.tsx         # Route definitions
│   └── providers.tsx      # Context providers
├── features/
│   └── pets/              # Pet adoption feature
│       ├── pages/         # Page components
│       ├── components/    # Feature components
│       ├── hooks/         # Custom hooks
│       ├── services/      # API services
│       └── validation/    # Validation schemas
├── models/                # Data models (classes)
├── shared/
│   ├── components/        # Reusable components
│   └── utils/             # Helper functions
├── styles/                # Global styles
└── types/                 # TypeScript types
```

## Technologies

- React 19
- TypeScript 4.9
- React Router 7
- React Hook Form 7
- SCSS Modules
