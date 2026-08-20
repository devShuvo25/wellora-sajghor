# Wellora Sajghor

Wellora Sajghor is a Next.js skincare storefront with customer, partner, and admin dashboard experiences.

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Useful checks:

```bash
npm run lint
npm run build
```

## Dashboard Routes

| Role | Entry route |
| --- | --- |
| Customer | `/account/custommer` |
| Partner or distributor | `/account` |
| Admin | `/dashboard/admin` |

Admin tabs are available below `/dashboard/admin`:

- `/dashboard/admin/orders`
- `/dashboard/admin/product-catalog`
- `/dashboard/admin/distributors`
- `/dashboard/admin/marketing-kits`
- `/dashboard/admin/settings`

The customer route intentionally keeps the existing `/account/custommer` spelling for compatibility.

## Current Role Routing

Role routing is centralized in [src/lib/dashboardAccess.ts](src/lib/dashboardAccess.ts).

`resolveDashboardRoute(role)` currently maps:

```text
admin, administrator -> /dashboard/admin
partner, distributor -> /account
anything else        -> /account/custommer
```

The shared account icon in [src/components/Navbar.tsx](src/components/Navbar.tsx) reads `state.auth.user.role` and uses this resolver. This is the frontend routing decision only. It must not be treated as authorization.

## Backend User Contract

The login and `/auth/me` responses should return a stable user object with a role:

```json
{
  "id": "usr_123",
  "email": "admin@wellora.com",
  "name": "Admin User",
  "role": "admin"
}
```

Recommended role values are `admin`, `partner`, `distributor`, and `customer`. If the backend uses different names, update `normalizeDashboardRole` in [src/lib/dashboardAccess.ts](src/lib/dashboardAccess.ts) rather than scattering role checks through components.

The login response should contain the access token and user:

```json
{
  "accessToken": "<token>",
  "user": {
    "id": "usr_123",
    "email": "admin@wellora.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

The existing auth flow already dispatches `setCredentials` after login. Make sure the real response is passed through instead of replacing it with demo fallback data.

## Implementing Real Role Access

### 1. Store the backend role after login

In `AuthForm.tsx` and `OtpForm.tsx`, use the backend user object:

```ts
const response = await login({ data: values }).unwrap();

dispatch(setCredentials({
  token: response.accessToken ?? response.token,
  user: response.user,
}));
```

Remove demo fallbacks such as `wellora-demo-token` when the backend is ready. The user role must come from the server response, never from a browser form field or local storage value.

### 2. Hydrate the user on refresh

Redux persistence keeps the token, but the safest source of the current role and permissions is the backend. Call `useGetMeQuery()` after authentication and replace the stored user with the response from `/auth/me`.

The `/auth/me` request must send the token through [src/redux/api/baseApi.ts](src/redux/api/baseApi.ts). If the API returns `401`, clear credentials and redirect to `/login`.

### 3. Protect routes on the server

The account icon only chooses a destination. The backend must enforce authorization on every protected API endpoint. Extend [src/middleware.ts](src/middleware.ts) so unauthenticated users cannot open dashboard URLs:

```ts
const protectedRoutes = ['/account', '/dashboard'];
```

For role-aware middleware, use a signed, server-readable session cookie or verify the JWT with a server-only secret. Do not trust a role stored only in Redux, local storage, or an unsigned cookie.

Conceptually, middleware should:

1. Redirect requests without a valid session to `/login`.
2. Read the verified role from the session.
3. Allow admins under `/dashboard/admin`.
4. Allow partners under `/account` and partner tabs.
5. Allow customers under `/account/custommer`.
6. Redirect authenticated users without permission to their own dashboard route.

The API must repeat these checks. Middleware is a navigation guard, not a replacement for backend authorization.

### 4. Add server-side permissions

Use permissions in addition to broad roles when the backend supports them:

```json
{
  "role": "admin",
  "permissions": ["orders.read", "orders.manage", "catalog.manage"]
}
```

Keep permission decisions in one access module. For example:

```ts
export function canAccess(permission: string, permissions: string[] = []) {
  return permissions.includes(permission);
}
```

Use the same permission names in backend policies and frontend visibility. Hiding a button is only a usability improvement; the API must still reject unauthorized requests.

## Relevant Files

- Admin shared tab UI: [src/components/admin/AdminTabPage.tsx](src/components/admin/AdminTabPage.tsx)
- Admin routes: [src/app/dashboard/admin/[tab]/page.tsx](src/app/dashboard/admin/[tab]/page.tsx)
- Partner dashboard: [src/components/portal/PartnerPortalPage.tsx](src/components/portal/PartnerPortalPage.tsx)
- Customer dashboard: [src/app/account/custommer/page.tsx](src/app/account/custommer/page.tsx)
- Shared footer: [src/components/dashboard/DashboardFooter.tsx](src/components/dashboard/DashboardFooter.tsx)
- Role routing: [src/lib/dashboardAccess.ts](src/lib/dashboardAccess.ts)
- Auth API: [src/redux/api/authApi.ts](src/redux/api/authApi.ts)
- Route middleware: [src/middleware.ts](src/middleware.ts)

Use `Link` or `router.push` for dashboard tab changes. This creates real browser history entries, so navigating from Overview to Orders and pressing Back returns to Overview instead of leaving the dashboard.

## Backend Integration Checklist

- Return a normalized role from login and `/auth/me`.
- Return permissions when the UI needs feature-level access.
- Send the access token on every API request.
- Replace demo login fallbacks with the real API response.
- Protect `/account` and `/dashboard` in middleware.
- Enforce roles and permissions again in backend controllers and services.
- Clear Redux credentials on logout and `401` responses.
- Test customer, partner, admin, unauthenticated, and forbidden-route cases.

## Architecture Notes

Keep role names and dashboard destinations in `src/lib/dashboardAccess.ts`. Keep dashboard presentation in reusable components. Keep authorization in the backend and verified server session layer. This prevents role logic from being duplicated across the Navbar, dashboard sidebars, pages, and API calls.
