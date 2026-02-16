# Lottery Pool

A Next.js application for calculating Mega-Sena lottery pool (Bolão) costs.

## Project Structure

```
lottery-pool/
├── src/
│   ├── app/      # Next.js app directory
│   ├── types/    # Domain and calculator types
│   └── constants/
├── package.json
└── tsconfig.json
```

## Features

- **Calculator**: Calculate how many lottery tickets (Volantes) can be purchased for your pool based on total amount and number of quotes
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **styled-components** for styling
- **Static export** - Deploy to any static hosting (GitHub Pages, Netlify, Vercel, etc.)

## Getting Started

### Quick Start with Makefile

```bash
# Install dependencies
make install

# Run development server
make dev
```

The app will run on `http://localhost:3000`

### Manual Setup

```bash
npm install
npm run dev
```

## Available Commands

```bash
make help          # Show all available commands
make install       # Install dependencies
make dev           # Run development server (http://localhost:3000)
make build         # Build for production
make type-check    # Run TypeScript type checking
make clean         # Clean build artifacts
make github-pages  # Build and prepare docs for GitHub Pages
```

## Static Export & Deployment

The app is configured to build as a static site. After building, all static files will be in `out/`.

### GitHub Pages Deployment

```bash
# Build and prepare docs folder
make github-pages

# Then commit and push
git add docs
git commit -m "Deploy to GitHub Pages"
git push

# In GitHub: Settings > Pages > Source: select "docs" folder
```

The `docs` folder will contain all static files ready for GitHub Pages hosting.
