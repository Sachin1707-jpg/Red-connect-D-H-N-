# 🤝 Contributing Guidelines - RedConnect

Thank you for your interest in contributing to **RedConnect**! We welcome community contributions to help build the world's most accessible blood donation network.

---

## 1. How to Get Started

1. **Fork the Repository**: Click the **Fork** button on GitHub.
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/your-username/redconnect-frontend.git
   cd redconnect-frontend
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```

---

## 2. Branch Naming Conventions

Create a topic branch for your work:

- Features: `feature/short-description` (e.g. `feature/donor-rewards-store`)
- Bug Fixes: `fix/issue-description` (e.g. `fix/pledge-modal-focus-trap`)
- Documentation: `docs/file-updated` (e.g. `docs/api-integration-guide`)

---

## 3. Pull Request Process

1. Ensure code passes linting and formatting tests:
   ```bash
   npm run lint
   npm run format
   ```
2. Commit your changes following [CODING_STANDARDS.md](CODING_STANDARDS.md) Conventional Commits format.
3. Push to your forked branch:
   ```bash
   git push origin feature/your-feature-name
   ```
4. Open a Pull Request (PR) against the `main` branch of the official RedConnect repository.

---

## 4. Code Review Checklist

Before approving a PR, reviewers verify:
- [ ] Documentation updated if features/APIs were modified.
- [ ] No regression in accessibility (WCAG AA compliance).
- [ ] Design tokens and CSS variables used instead of inline hardcoded values.
- [ ] Redux state mutations remain pure and serializable.
