# 🎬 Animation Guide - RedConnect

This document details the motion choreography, CSS transition tokens, and Framer Motion spring physics specifications for RedConnect.

---

## 1. Design System Animation Tokens

```css
:root {
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
  --spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 2. Micro-Interactions & Hover Effects

### 2.1 Buttons
- **Hover**: Subtle scale expansion (`transform: scale(1.02)`) paired with glow box shadow transition.
- **Active / Tap**: Slight depression compression (`transform: scale(0.98)`).

### 2.2 Cards
- **Hover Transition**: `transform: translateY(-4px)` with box shadow expanding from `0 4px 6px` to `0 12px 20px rgba(0,0,0,0.1)`.

---

## 3. Overlay Animations (Modals & Toasts)

### 3.1 Modal Entry Spring Physics (Framer Motion)
```jsx
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: 'spring', damping: 25, stiffness: 300 } 
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } }
};
```

### 3.2 Toast Entry Animation
- Slide in from top-right boundary (`x: 100% -> 0%`) with spring bounce.

---

## 4. Skeleton Shimmer Effect

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-box {
  background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```
