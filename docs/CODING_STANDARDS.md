# 📜 Coding Standards & Guidelines - RedConnect

This document details style conventions, file naming standards, Redux Toolkit patterns, and Git commit guidelines enforced across the RedConnect repository.

---

## 1. Naming Conventions

| Entity | Case Convention | Example |
|---|---|---|
| **React Components** | `PascalCase` | `EmergencyRequestCard.jsx`, `Button.jsx` |
| **Custom Hooks** | `camelCase` starting with `use` | `useAuth.js`, `useBloodRequests.js` |
| **Utility Functions** | `camelCase` | `formatDate.js`, `calculateDistance.js` |
| **Redux Slices** | `camelCase` ending with `Slice` | `bloodRequestsSlice.js`, `authSlice.js` |
| **CSS Variables** | `kebab-case` starting with `--` | `--color-primary`, `--space-4` |

---

## 2. Component Guidelines

1. **Single Responsibility**: Each component file exports a single primary component.
2. **Prop Interfaces**: Components declare explicit default props or default destructuring parameters.
3. **No Direct DOM Mutations**: Always utilize React state or refs for DOM access.

---

## 3. Redux Toolkit Conventions

- Use `createSlice` for feature state declarations.
- Keep slice reducers pure and deterministic.
- Async thunks placed alongside slice definitions or in dedicated service files.

---

## 4. Conventional Git Commit Messages

Git commit messages must follow the **Conventional Commits** specification:

```
<type>(<scope>): <short summary>

[optional body]
```

### Allowed Types:
- `feat`: A new user-facing feature.
- `fix`: A bug fix.
- `docs`: Documentation updates.
- `style`: Formatting changes (white-space, missing semi-colons).
- `refactor`: Code restructuring without functional behavior changes.
- `test`: Adding or modifying test cases.

### Examples:
- `feat(requests): add O-negative emergency pledge confirmation modal`
- `fix(auth): resolve JWT expiration token flush handling`
- `docs(prd): update 30 user story acceptance criteria`
