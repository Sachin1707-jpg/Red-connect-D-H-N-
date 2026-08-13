# 📱 Responsive Design Specifications - RedConnect

This document details the responsive breakpoints, layout grid adaptations, touch target specifications, and component behaviors across device viewports.

---

## 1. Responsive Breakpoints Scale

RedConnect adopts a **mobile-first CSS media query strategy**:

| Device Category | Screen Width Range | CSS Media Query | Primary Layout Changes |
|---|---|---|---|
| **Mobile** | `< 640px` | Default (Mobile First) | Single-column cards, full-width buttons, slide-over drawer navigation, hidden desktop sidebar. |
| **Tablet** | `640px - 1024px` | `@media (min-width: 640px)` | 2-column request card grid, horizontal filter pills, condensed sidebar. |
| **Laptop** | `1024px - 1280px` | `@media (min-width: 1024px)` | 3-column card grid, visible left dashboard sidebar, top sticky navbar. |
| **Desktop / Wide** | `> 1280px` | `@media (min-width: 1280px)` | 4-column card grid, maximum container cap `1280px` with auto margins. |

---

## 2. Component Layout Adaptations

### 2.1 Top Navbar Navigation
- **Desktop (`>1024px`)**: Displays full inline horizontal nav links, search bar, notification bell icon, and user profile avatar.
- **Mobile (`<1024px`)**: Nav links and search bar collapse into a hamburger menu button. Clicking slides open a full-height right-side drawer navigation menu.

### 2.2 Dashboard Sidebar
- **Desktop (`>1024px`)**: Fixed left-side vertical navigation bar (`width: 260px`). Content offset left by `260px`.
- **Mobile (`<1024px`)**: Sidebar transforms into a bottom tab bar or off-canvas overlay triggered via header breadcrumb.

### 2.3 Emergency Request Cards Grid
- Mobile: `grid-template-columns: 1fr;`
- Tablet: `grid-template-columns: repeat(2, 1fr);`
- Laptop: `grid-template-columns: repeat(3, 1fr);`
- Desktop: `grid-template-columns: repeat(4, 1fr);`

---

## 3. Touch Target Minimums

- All interactive controls (Buttons, Select Inputs, Pagination arrows, Status toggles) maintain a **minimum touch target area of 44px x 44px** on mobile screens to ensure seamless finger interaction.
- Spacing between adjacent buttons on mobile viewports is fixed at a minimum of `12px` (`space-3`) to prevent accidental mis-taps.
