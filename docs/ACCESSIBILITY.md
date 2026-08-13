# ♿ Accessibility (a11y) Standards - RedConnect

RedConnect is built to meet **WCAG 2.1 Level AA Accessibility Standards**, ensuring that emergency blood requests and donor features are usable by individuals with visual, motor, or cognitive impairments.

---

## 1. Core Accessibility Principles

1. **Perceivable**: All visual information is accompanied by textual alternatives (e.g. `aria-label` for icon buttons, `alt` text for images).
2. **Operable**: Full platform functionality is executable via keyboard navigation (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Esc`).
3. **Understandable**: Standardized labels, explicit validation error messages, and consistent modal trap behavior.
4. **Robust**: Semantic HTML markup compatible with modern screen readers (NVDA, VoiceOver, JAWS).

---

## 2. Keyboard Navigation Standards

- **Focus Ring Indicator**: All interactive elements feature a visible high-contrast focus outline (`2px solid #DC2626` with `2px offset`). Default browser focus outlines are never hidden with `outline: none` unless replaced by custom focus rings.
- **Skip to Content Link**: A hidden `"Skip to main content"` link is positioned as the very first focusable element on every page (`href="#main-content"`).
- **Modal Traps**: When a modal opens (e.g., `PledgeModal` or `CreateRequestModal`), focus is programmatically shifted to the modal container, trapping focus inside until closed via `Esc` key or close button.

---

## 3. ARIA & Semantic HTML Guidelines

### 3.1 Semantic Elements
- `<header>` for Top Navbar.
- `<nav>` for navigation link groups.
- `<main id="main-content">` for primary view content.
- `<aside>` for dashboard sidebars.
- `<article>` for individual `EmergencyRequestCard` components.
- `<footer>` for bottom page footer.

### 3.2 ARIA Attributes Matrix
```jsx
// Icon-Only Buttons
<button aria-label="Notifications (3 unread)" onClick={openNotifications}>
  <Bell size={20} />
  <span className="badge">3</span>
</button>

// Live Region for Emergency Alerts
<div role="status" aria-live="polite" className="toast-container">
  {toasts.map(t => <Toast key={t.id} message={t.message} />)}
</div>

// Form Input Validation
<input 
  id="email-field"
  type="email"
  aria-invalid={errors.email ? "true" : "false"}
  aria-describedby={errors.email ? "email-error-msg" : undefined}
/>
{errors.email && <span id="email-error-msg">{errors.email.message}</span>}
```

---

## 4. Color Contrast Ratios

- Standard Body Text: Minimum contrast ratio of **4.5:1** against background.
- Large Headings (`>24px`): Minimum contrast ratio of **3.0:1**.
- UI Controls & Badges: Minimum contrast ratio of **3.0:1**.
- Emergency Alerts: White text on `#DC2626` Crimson Red yields a compliant ratio of **5.8:1**.
