# **App Name**: EastAsian Serenity Tracker

## Core Features:

- Content Search & Discovery: Search for Korean and Chinese dramas and movies using an external API (e.g., TMDb) and display results.
- Detailed Content Pages: Dedicated pages for each drama or movie, displaying comprehensive information fetched from the API.
- Watched Status & Progress Tracking: Users can mark dramas/movies as watched and track their viewing progress, saved to the database.
- User Ratings & Reviews: Allow users to assign personal ratings and optionally write short reviews for content, stored securely.
- Personalized Favorites List: Users can add dramas and movies to a personalized favorites list for easy access, persisted in the database.
- Secure User Authentication: Robust user authentication and authorization system to manage user accounts and data privacy.
- AI-Powered Recommendation Tool: An AI tool that suggests new dramas or movies based on the user's watched history and ratings.

## Style Guidelines:

- Primary Color: Soft Periwinkle Blue (#9595DA) for a calming, reflective user experience.
- Background Color: Muted Lavender Grey (#EFEFF6), a very light and subtle shade of the primary hue for spaciousness.
- Accent Color: Vibrant Ocean Blue (#2289DB) to highlight interactive elements and call-to-actions, providing clear contrast.
- Body and headline font: 'Inter' (sans-serif) for modern clarity and excellent readability across all text lengths.
- Utilize clean, minimal line-art icons to maintain a sophisticated and serene aesthetic consistent with the color palette.
- Employ a clean, grid-based layout for content listings, with generous spacing. Detail pages will feature a focused, content-first design with ample imagery.
- Implement subtle, smooth transitions for page navigation and hover effects, enhancing the app's serene feel without being distracting.

## Implementation Status (Current)

- Implemented routes: Home, Search, Dashboard, and Content Detail.
- Implemented data source: TMDb integration with fallback mock data for resilience.
- Implemented AI path: Genkit flow exists for recommendations.
- Implemented UI system: Tailwind + reusable UI components.
- Planned but not fully implemented: user auth, persistent favorites/watched/reviews, and complete production hardening.

## Cost Constraint (Must Stay Free For Now)

- The product must run on free tiers during MVP.
- TMDb: free API usage with attribution and quota awareness.
- Firebase: Spark plan only (auth, Firestore, hosting where applicable).
- AI in production: optional only. Default recommendation path must not require paid model calls.

## Free-First Architecture Decisions

- Recommendation engine default: deterministic, rule-based recommendations.
- AI recommendations: behind feature flag for local/dev or controlled experiments.
- Data model: user-scoped documents only, small document shapes, paginated reads.
- Caching: cache TMDb responses and avoid unnecessary re-fetching.
- Reliability: every critical feature needs loading, empty, and error states.

## Roadmap (Phased)

### Phase 1: Core UX Stabilization

- Add missing Favorites and Watched routes so there are no dead links.
- Add shared loading/empty/error states.
- Update app metadata and branding consistency.
- Add graceful not-found handling for content detail pages.

### Phase 2: Auth and Data Foundation

- Implement Firebase Auth (Google + email/password).
- Add user session context for app-wide access.
- Implement Firestore repositories for profile, favorites, and watched items.

### Phase 3: Tracking Workflows

- Wire content actions: Add to Favorites, Mark Watched, Save Progress, ratings/reviews.
- Build Favorites and Watched pages with filtering and pagination.

### Phase 4: Free Recommendation Engine

- Implement rule-based recommendations from watched history and ratings.
- Keep Genkit AI as optional fallback behind env flag.
- Ensure dashboard always returns useful recommendations even when AI is off.

### Phase 5: Security, Reliability, and CI

- Harden Firestore security rules for strict per-user access.
- Add request/data validation for all writes.
- Add TMDb caching + retry strategy.
- Add CI checks (typecheck, lint, build) and smoke tests.

### Phase 6: Release Readiness

- Add deployment and rollback runbook.
- Execute final QA checklist and release candidate verification.

## Prioritized Ticket Backlog (MVP)

For the full prioritized table, sprint plan, and delivery checklist, see [docs/roadmap.md](docs/roadmap.md).

- P0: Create Favorites route page.
- P0: Create Watched route page.
- P0: Add Firebase config/env contract.
- P0: Implement Auth flows.
- P0: Implement Firestore favorites and watched repositories.
- P0: Wire Add to Favorites and Mark Watched actions.
- P0: Implement rule-based recommendation service.
- P0: Add Firestore security rules.
- P0: Add CI quality gates.

## Definition of Done (MVP)

- Users can sign in, search, view details, and persist favorites/watched progress.
- Dashboard recommendations work with no paid AI dependency.
- No broken routes and no critical runtime errors in main flows.
- Security rules enforce per-user data isolation.
- CI checks pass for lint, typecheck, and build.
