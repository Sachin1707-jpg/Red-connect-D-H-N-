# 🔒 Security Guidelines & Architecture - RedConnect

Security policies, authentication practices, token storage strategies, input sanitization rules, and protective measures against XSS, CSRF, and data leakage in RedConnect.

---

## 1. Authentication & Token Management

### Token Handling
- **JWT Storage**: Authentication tokens are stored securely in memory or `HttpOnly` cookies. Where `localStorage` is used during local development, token keys are namespaced (`redconnect_auth_token`).
- **Authorization Header**: All outgoing HTTP requests attach bearer tokens via Axios request interceptor:
```javascript
apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
- **Auto-Logout on 401**: Axios response interceptors catch `401 Unauthorized` responses and automatically dispatch `logout()` to flush unauthenticated state.

---

## 2. Cross-Site Scripting (XSS) Prevention

1. **React Auto-Escaping**: All user-generated content (e.g. hospital names, patient notes, request descriptions) is rendered via standard React JSX text nodes, preventing raw HTML injection.
2. **Sanitization**: In cases where HTML strings must be processed, `DOMPurify` is enforced.
3. **No `dangerouslySetInnerHTML`**: Usage of `dangerouslySetInnerHTML` is strictly prohibited across the entire codebase.

---

## 3. Form Input Validation

- All form inputs are validated client-side using `Zod` schemas before submission.
- Prevents malformed inputs, SQL/NoSQL injection string patterns, and overly long payloads from hitting API endpoints.

---

## 4. Role-Based Access Control (RBAC)

- Route components are encapsulated in `<ProtectedRoute allowedRoles={['hospital']} />`.
- Prevents unauthorized role escalation (e.g., a voluntary Donor trying to access hospital inventory routes at `/hospital/inventory`).
