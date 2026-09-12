# AGENTS.md

## Project overview

Oel is a personal beer-tracking application. Its main product areas are:

1. **Beers** — a list of beers the user has tasted. Selecting a beer opens its detail view and shows every beer log associated with it.
2. **Beer logs** — individual occasions on which the user had a beer, including a rating and contextual information.
3. **Map** — a Leaflet view showing beer logs that have stored coordinates. Avoid inventing additional map or geocoding requirements unless the task calls for them.

Keep the distinction between a beer and a beer log clear: a `Beer` describes the beverage, while a `BeerLog` describes one drinking occasion and belongs to a beer.

## Repository layout

- `src/oel.api/` — ASP.NET Core Web API targeting .NET 10.
- `src/oel.frontend/` — Vite, React, and TypeScript frontend.
- `bruno/` — Bruno collections for manually exercising the API.
- `README.md` — top-level project introduction.

## Backend conventions

- Use ASP.NET Core controllers and Entity Framework Core with SQL Server.
- The EF Core context is `OelContext`; entities currently live in `Models/` and enums in `Enums/`.
- The application uses `/api` as its path base. Controller routes are therefore exposed below `/api` (for example, `/api/beer`).
- Use asynchronous EF Core and controller APIs for new or substantially changed database operations when practical, and accept a `CancellationToken` for request-bound work.
- Keep controllers focused on HTTP concerns. Move reusable or growing business logic into appropriately named services rather than expanding controllers indefinitely.
- Validate request data and return suitable HTTP status codes. Do not expose database exceptions, connection strings, stack traces, or other internal details to clients.
- Avoid accepting or returning EF navigation graphs blindly. Introduce request/response DTOs when an endpoint's shape differs from the persistence model or when doing so prevents over-posting and serialization issues.
- Preserve the `Beer` to `BeerLog` relationship. A beer detail endpoint or response should be designed deliberately to include or separately retrieve its related logs without introducing circular serialization.
- Store timestamps as `DateTimeOffset` and preserve their offsets unless a feature explicitly specifies another policy.
- Ratings are on a 0–5 scale; enforce this at the API boundary when touching rating creation or updates.
- Treat database schema changes as migrations. Keep the entity model, `OelContext`, migrations, and API contract consistent.
- Never commit secrets or machine-specific connection strings. Use development configuration, user secrets, or environment variables as appropriate.
- The API currently applies pending migrations at startup. Account for that behavior when changing startup or persistence configuration.

### Backend verification

- Build backend changes with:

  ```bash
  dotnet build src/oel.api/Oel.Api.csproj
  ```

- Use the Bruno requests in `bruno/` or another focused manual request to verify endpoint behavior when relevant.
- **Do not create backend API tests.** Backend work does not require new unit, integration, or end-to-end API tests unless the user explicitly asks for them in a future task.
- Do not remove or weaken any existing tests if backend tests are added later; the instruction above only means agents should not create new backend tests by default.

## Frontend conventions

- The frontend uses Vite, React, TypeScript, React Router, TanStack Query, Tailwind CSS, and shadcn/ui.
- Use TypeScript strictly. Avoid `any`; model API payloads explicitly and keep frontend types aligned with backend contracts.
- Use the `@/` alias for imports from `src/`.
- Put route-level screens in `src/pages/`, shared layout in `src/layouts/`, reusable application components in `src/components/`, and shadcn/ui primitives in `src/components/ui/`.
- Use Tailwind CSS v4 utility classes for application and component styling. Do not add project-authored custom CSS rules, component selectors, CSS modules, styled components, or inline style objects. Required vendor stylesheets, such as Leaflet's packaged CSS, may still be imported.
- Use shadcn/ui components whenever a suitable component exists. Check `src/oel.frontend/src/components/ui/` first; if a component is not installed, consult its official shadcn component page and install it from `src/oel.frontend/` with the npm command shown there (typically `npx shadcn@latest add <component>`).
- Follow each shadcn component page's documented composition and usage closely. Compose and customize shadcn components only through their supported props, Tailwind CSS v4 utility classes, and the existing design tokens; do not add custom CSS for them.
- Keep shared primitives generic and put beer-specific behavior in feature or page components.
- Define routes in the React Router tree and use links/navigation rather than full page reloads.
- Route server state through TanStack Query. Keep query keys centralized, use the shared `fetchApi` wrapper, and invalidate the narrowest relevant keys after successful mutations.
- Do not duplicate server state into local component state without a concrete UI reason. Use local state for transient UI concerns such as form input, dialog state, and filters.
- Always handle loading, error, empty, and success states for API-backed views.
- Keep the UI responsive and mobile-friendly. The bottom navigation is used on smaller screens; desktop behavior belongs in the shared layout.
- Preserve the interface's existing language unless a task explicitly requests copy or localization changes.
- For map changes, keep location data and presentation separable. Do not add another map provider, a geocoder, an API key, or a new coordinate model without an explicit requirement.

### Frontend verification

Run commands from `src/oel.frontend/` or use the shown prefix:

```bash
npm --prefix src/oel.frontend run lint
npm --prefix src/oel.frontend run build
```

When changing interactions or layout, also inspect the affected screen at both mobile and desktop widths when tooling permits.

## API and data changes

- Coordinate contract changes across both applications in the same task: update backend DTOs/endpoints, frontend models, query hooks, and affected UI together.
- Use JSON property naming consistent with the existing ASP.NET Core camel-case responses and frontend models.
- Keep list endpoints and detail endpoints purposeful. Beer lists should not accidentally fetch large log histories; beer detail views must still provide a clear way to obtain the related logs.
- Avoid destructive migrations or silent data reinterpretation. If a requested schema change could lose existing beer or log data, call out the risk before applying it.

## Working practices

- Make the smallest cohesive change that completes the requested behavior.
- Follow existing naming and folder conventions before introducing new abstractions or dependencies.
- Do not modify generated EF migration files by hand after generation except to correct a clearly understood migration issue.
- Do not add packages when the existing stack can solve the task cleanly. If a new package is justified, explain its purpose and keep lockfiles in sync.
- Preserve unrelated user changes in the working tree.
- Update relevant documentation or Bruno requests when an API workflow or developer command changes.
- Before finishing, report what changed, which verification commands ran, and any limitations or follow-up work that remains.
