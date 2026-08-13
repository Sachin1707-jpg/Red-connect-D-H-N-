# 🎨 UI/UX Guidelines - RedConnect

RedConnect is designed with a premium, human-centric visual language. The visual interface evokes trust, critical urgency, clarity, and compassionate community action.

---

## 1. Design Principles

1. **Clarity Under Urgency**: During medical emergencies, cognitive load must be minimized. Critical actions (e.g. "Pledge Help", "Create Request") feature high-contrast, unmistakable styling.
2. **Empathetic & Lifesaving Aesthetics**: Avoid clinical/depressing visual tone. Use warm primary reds, energetic coral accents, clean dark modes, and soft rounded elevation surfaces.
3. **Inclusive Accessibility**: All text elements meet WCAG 2.1 AA contrast requirements. Interactive controls feature visible focus outlines for screen readers and keyboard navigation.

---

## 2. Color Palette

```
[Crimson Red]      #DC2626  (Primary Action / Urgency)
[Emergency Coral]  #EF4444  (Active Alerts / Pledges)
[Blood Rose]       #FEF2F2  (Background Tint / Light Accents)
[Slate Dark]       #0F172A  (Primary Dark Surface / Text)
[Emerald Green]    #10B981  (Verified / Available / Success)
[Amber Gold]       #F59E0B  (Warnings / Medium Urgency / Badges)
```

### Color Variables Reference
```css
:root {
  --color-primary: #DC2626;
  --color-primary-hover: #B91C1C;
  --color-primary-light: #FEF2F2;
  --color-secondary: #0F172A;
  --color-accent: #EF4444;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #991B1B;
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-text-main: #1E293B;
  --color-text-muted: #64748B;
  --color-border: #E2E8F0;
}
```

---

## 3. Typography

- **Primary Font**: `Outfit`, sans-serif (Headings, Stat Counters, Badges)
- **Body Font**: `Inter`, sans-serif (Body text, Form Inputs, Tables)

| Scale | Size | Line Height | Usage |
|---|---|---|---|
| `display-1` | 48px / 3rem | 1.1 | Homepage Hero Headings |
| `h1` | 36px / 2.25rem | 1.2 | Main Page Titles |
| `h2` | 28px / 1.75rem | 1.3 | Section Headers, Modal Titles |
| `h3` | 20px / 1.25rem | 1.4 | Card Headings, Dashboard Modules |
| `body-lg` | 18px / 1.125rem | 1.5 | Subtitles, Hero Paragraphs |
| `body-md` | 16px / 1rem | 1.5 | Standard Body Text, Table Cells |
| `body-sm` | 14px / 0.875rem | 1.4 | Form Labels, Secondary Metadata |
| `caption` | 12px / 0.75rem | 1.3 | Timestamps, Footnotes, Micro Badges |

---

## 4. Spacing Scale

RedConnect enforces an **8-point grid system**:

- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px (Standard padding)
- `space-6`: 24px (Card padding)
- `space-8`: 32px (Section spacing)
- `space-12`: 48px (Major container margins)

---

## 5. Component Style Specifications

### 5.1 Buttons
- **Primary / Emergency**: Solid `#DC2626` background, white bold text, subtle red glow shadow on hover (`box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4)`).
- **Secondary**: Solid `#0F172A` background, white text.
- **Outline**: Transparent background, 2px border `#DC2626`, `#DC2626` text.
- **Ghost**: Transparent background, text hover transition.

### 5.2 Cards
- `background-color: #FFFFFF;`
- `border-radius: 12px;`
- `border: 1px solid #E2E8F0;`
- `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);`
- Hover state: Slight vertical translation (`transform: translateY(-2px)`) and increased shadow.

### 5.3 Modals
- Dark semi-transparent backdrop overlay (`rgba(15, 23, 42, 0.6)`) with `backdrop-filter: blur(4px)`.
- Center-aligned modal card container with spring entry animation.

### 5.4 Sidebar & Navbar
- **Navbar**: Sticky header with semi-transparent white background (`backdrop-filter: blur(12px)`), logo brand mark, search input, notification bell with unread badge count, and user avatar.
- **Sidebar**: Dark slate container (`#0F172A`) for dashboards with glowing active link indicators and badge counts.

---

## 6. System States (Loading, Empty, Error)

### 6.1 Loading States
- Skeleton loaders for cards, tables, and profile blocks using soft shimmer keyframe animations.
- Pulsing red heart icon loader for emergency request processing.

### 6.2 Empty States
- Custom illustrated vector representations for empty states (e.g., *"No active emergency requests in your area right now"* or *"No past pledges logged yet"*).
- Always accompanied by a helpful call-to-action button (e.g., *"Expand Search Radius"* or *"Register as a Donor"*).

### 6.3 Error States
- Inline field validation errors rendered in crisp `#DC2626` with error icon.
- Full page error boundary fallback for unexpected JavaScript exceptions.
