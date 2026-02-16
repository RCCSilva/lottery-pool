.PHONY: help install dev build clean type-check github-pages

# Default target
help:
	@echo "Available commands:"
	@echo "  make install       - Install dependencies"
	@echo ""
	@echo "  make dev           - Run development server (http://localhost:3000)"
	@echo ""
	@echo "  make build         - Build for production"
	@echo ""
	@echo "  make type-check    - Run TypeScript type checking"
	@echo ""
	@echo "  make clean         - Clean build artifacts"
	@echo ""
	@echo "  make github-pages  - Build and prepare docs folder for GitHub Pages"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install

# Development server
dev:
	@echo "🚀 Starting development server..."
	npm run dev

# Build
build:
	@echo "🔨 Building..."
	npm run build

# Type checking
type-check:
	@echo "🔍 Type checking..."
	npm run type-check

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf .next
	rm -rf out
	rm -rf node_modules/.cache

# GitHub Pages
github-pages: build
	@echo "📦 Preparing GitHub Pages deployment..."
	@if [ ! -d "out" ]; then \
		echo "❌ Error: out directory not found. Run 'make build' first."; \
		exit 1; \
	fi
	@echo "📁 Creating docs folder..."
	@rm -rf docs
	@mkdir -p docs
	@echo "📋 Copying static files to docs folder..."
	@cp -r out/* docs/
	@echo "✅ GitHub Pages folder created at ./docs/"
	@echo "💡 To deploy:"
	@echo "   1. Commit the docs folder: git add docs && git commit -m 'Deploy to GitHub Pages'"
	@echo "   2. Push to your repository: git push"
	@echo "   3. In GitHub Settings > Pages, select 'docs' folder as source"
