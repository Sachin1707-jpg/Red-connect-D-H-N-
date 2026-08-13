# 🏗️ Project Structure - RedConnect

This document outlines the high-level structural breakdown of the RedConnect repository, mapping files, documentation assets, and build outputs.

---

## 📂 Repository Root Overview

```
red_connect/
├── docs/                        # Comprehensive Documentation Suite (28 Files)
├── public/                      # Static Assets (Favicon, Web Manifest, Images)
├── src/                         # Application Source Code
│   ├── assets/                  # Scalable Vector Graphics, Logos, Illustrations
│   ├── components/              # Atomic & Domain-Specific Components
│   ├── config/                  # Global Theme Tokens & App Config Constants
│   ├── hooks/                   # Custom Utility & State Management Hooks
│   ├── layouts/                 # Page Framing Layouts (Public, Dashboard)
│   ├── pages/                   # Views & Page Containers
│   ├── services/                # API Client Layer & Mock Handlers
│   ├── store/                   # Redux Store Setup & State Slices
│   ├── styles/                  # Global CSS Variables & Typography Rules
│   └── utils/                   # Shared Helper Utilities
├── index.html                   # HTML5 Entry point
├── package.json                 # Node.js dependencies & scripts
├── vite.config.js               # Vite build tool configuration
└── README.md                    # Root project landing README
```

---

## 📄 Documentation Tree Map (`/docs`)

```
docs/
├── README.md                    # GitHub landing documentation
├── PRD.md                       # Product Requirement Document & 30+ User Stories
├── PROJECT_STRUCTURE.md         # Structural breakdown & repository map
├── SYSTEM_ARCHITECTURE.md       # Overall architecture, React & Redux flows
├── FRONTEND_ARCHITECTURE.md     # Layered architecture, services, hooks
├── UI_UX_GUIDELINES.md          # Color tokens, typography, spacing, UI states
├── DESIGN_SYSTEM.md             # Reusable design components specification
├── COMPONENT_DOCUMENTATION.md   # Core component documentation & props
├── ROUTING.md                   # Public, private, protected routes & router hierarchy
├── STATE_MANAGEMENT.md          # Redux Toolkit store, slices, selectors, state shapes
├── API_INTEGRATION_GUIDE.md     # REST API contracts, requests, responses, errors
├── DATA_FLOW.md                 # User journeys, Redux actions, API data flows
├── MOCK_DATA.md                 # Realistic mock JSON datasets
├── FOLDER_STRUCTURE.md          # Detailed src/ folder structure tree
├── FEATURES.md                  # Comprehensive feature matrix & priorities
├── USER_FLOW.md                 # User journey diagrams for all roles
├── PAGES.md                     # Page-by-page functional specs
├── COMPONENT_TREE.md            # Component hierarchy tree & Mermaid diagram
├── RESPONSIVE_DESIGN.md         # Breakpoints, mobile adaptions, grid layouts
├── ACCESSIBILITY.md             # WCAG AA compliance, ARIA standards, contrast
├── PERFORMANCE.md               # Lazy loading, bundle size limits, optimization
├── SECURITY.md                  # Token storage, auth guards, XSS/CSRF prevention
├── ANIMATION_GUIDE.md           # CSS/Framer Motion animation specifications
├── CODING_STANDARDS.md          # Code standards, formatting, commit guidelines
├── CONTRIBUTING.md              # Open-source contribution workflow
├── CHANGELOG.md                 # Semantic release history
├── TODO.md                      # Categorized task tracking
└── ROADMAP.md                   # Six-phase strategic roadmap
```

---

## 🎨 Asset Architecture (`src/assets/`)

- `src/assets/icons/`: SVG icon components and Lucide icon wrappers.
- `src/assets/images/`: Optimized WebP images for landing hero visuals, blood donation graphics, and empty state illustrations.
- `src/assets/badges/`: Gamification achievement badge vector graphics (*LifeSaver*, *Hero*, *Bronze*, *Gold*).

---

## ⚡ Output Build Structure (`dist/`)

When running `npm run build`, Vite produces the following static production distribution:

```
dist/
├── assets/
│   ├── index-[hash].js         # Main bundled JavaScript bundle
│   ├── index-[hash].css        # Extracted & compressed CSS stylesheet
│   └── vendor-[hash].js        # Third-party dependencies split chunk
├── index.html                   # HTML entry point with dynamic bundle links
└── favicon.ico                  # Compressed web icon
```
