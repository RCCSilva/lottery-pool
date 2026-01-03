.PHONY: help install install-backend install-frontend dev dev-backend dev-frontend build build-backend build-frontend clean clean-backend clean-frontend type-check type-check-backend type-check-frontend github-pages

# Default target
help:
	@echo "Available commands:"
	@echo "  make install          - Install dependencies for both backend and frontend"
	@echo "  make install-backend  - Install backend dependencies only"
	@echo "  make install-frontend - Install frontend dependencies only"
	@echo ""
	@echo "  make dev              - Run both backend and frontend in development mode"
	@echo "  make dev-backend      - Run backend development server only"
	@echo "  make dev-frontend     - Run frontend development server only"
	@echo ""
	@echo "  make build            - Build both backend and frontend"
	@echo "  make build-backend    - Build backend only"
	@echo "  make build-frontend   - Build frontend only"
	@echo ""
	@echo "  make type-check       - Run TypeScript type checking for both projects"
	@echo "  make type-check-backend  - Run TypeScript type checking for backend only"
	@echo "  make type-check-frontend - Run TypeScript type checking for frontend only"
	@echo ""
	@echo "  make clean            - Clean build artifacts for both projects"
	@echo "  make clean-backend    - Clean backend build artifacts only"
	@echo "  make clean-frontend   - Clean frontend build artifacts only"
	@echo ""
	@echo "  make github-pages     - Build frontend and prepare docs folder for GitHub Pages"

# Install dependencies
install: install-backend install-frontend

install-backend:
	@echo "📦 Installing backend dependencies..."
	cd backend && npm install

install-frontend:
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install

# Development servers
dev: dev-backend dev-frontend

dev-backend:
	@echo "🚀 Starting backend development server..."
	cd backend && npm run dev

dev-frontend:
	@echo "🚀 Starting frontend development server..."
	cd frontend && npm run dev

# Build projects
build: build-backend build-frontend

build-backend:
	@echo "🔨 Building backend..."
	cd backend && npm run build

build-frontend:
	@echo "🔨 Building frontend..."
	cd frontend && npm run build

# Type checking
type-check: type-check-backend type-check-frontend

type-check-backend:
	@echo "🔍 Type checking backend..."
	cd backend && npm run type-check

type-check-frontend:
	@echo "🔍 Type checking frontend..."
	cd frontend && npm run type-check

# Clean build artifacts
clean: clean-backend clean-frontend

clean-backend:
	@echo "🧹 Cleaning backend build artifacts..."
	rm -rf backend/dist
	rm -rf backend/node_modules/.cache

clean-frontend:
	@echo "🧹 Cleaning frontend build artifacts..."
	rm -rf frontend/.next
	rm -rf frontend/out
	rm -rf frontend/node_modules/.cache

# GitHub Pages
github-pages: build-frontend
	@echo "📦 Preparing GitHub Pages deployment..."
	@if [ ! -d "frontend/out" ]; then \
		echo "❌ Error: frontend/out directory not found. Run 'make build-frontend' first."; \
		exit 1; \
	fi
	@echo "📁 Creating docs folder..."
	@rm -rf docs
	@mkdir -p docs
	@echo "📋 Copying static files to docs folder..."
	@cp -r frontend/out/* docs/
	@echo "✅ GitHub Pages folder created at ./docs/"
	@echo "💡 To deploy:"
	@echo "   1. Commit the docs folder: git add docs && git commit -m 'Deploy to GitHub Pages'"
	@echo "   2. Push to your repository: git push"
	@echo "   3. In GitHub Settings > Pages, select 'docs' folder as source"

