# Roadmap

## Planning Assumptions

- Team size: 1 developer.
- Schedule: 6 weeks, part-time to full-time flexible.
- Cost rule: must stay on free tiers for now.
- Estimation scale:
  - S = 2-4 hours
  - M = 1 day
  - L = 2-3 days

## Epic Overview

- E1 Core UX Stabilization
- E2 Auth + Data Persistence
- E3 Watch/Favorites Workflows
- E4 Free Recommendation Engine
- E5 Security + Reliability + CI
- E6 Launch Readiness

## Backlog (Prioritized)

| ID  | Epic | Task                                            | Priority | Size | Depends On | Acceptance Criteria                                          |
| --- | ---- | ----------------------------------------------- | -------- | ---- | ---------- | ------------------------------------------------------------ |
| T01 | E1   | Add missing Favorites route page                | P0       | S    | None       | Navbar link opens valid page; empty state shown              |
| T02 | E1   | Add missing Watched route page                  | P0       | S    | None       | Navbar link opens valid page; empty state shown              |
| T03 | E1   | Create shared loading/empty/error UI blocks     | P1       | S    | None       | Reused on search, dashboard, favorites, watched              |
| T04 | E1   | Replace placeholder metadata and app title      | P1       | S    | None       | Browser title/description reflect product branding           |
| T05 | E1   | Add not-found handling for content detail route | P1       | S    | None       | Invalid IDs show graceful UI, no crash                       |
| T06 | E2   | Add Firebase config module and env contract     | P0       | M    | None       | App boot works with Spark env vars; clear error when missing |
| T07 | E2   | Implement Auth: Google + Email/Password         | P0       | L    | T06        | Sign in/out works; session persisted                         |
| T08 | E2   | Add protected user state provider/hooks         | P0       | M    | T07        | User state available across pages                            |
| T09 | E2   | Create Firestore repositories for user profile  | P1       | M    | T06        | Profile create/read/update works                             |
| T10 | E2   | Create Firestore repositories for favorites     | P0       | M    | T06        | Add/remove/list favorites works per user                     |
| T11 | E2   | Create Firestore repositories for watched items | P0       | M    | T06        | Add/update/list watched works per user                       |
| T12 | E3   | Wire content detail Add to Favorites action     | P0       | M    | T10        | Button persists favorite and updates UI state                |
| T13 | E3   | Wire content detail Mark Watched action         | P0       | M    | T11        | Button creates watched record with progress defaults         |
| T14 | E3   | Wire Save Progress and rating/review action     | P1       | M    | T11        | Progress and rating persist; validation in place             |
| T15 | E3   | Build Favorites list with pagination/sort       | P1       | M    | T10        | User sees paged/sorted favorites                             |
| T16 | E3   | Build Watched list with progress filters        | P1       | M    | T11        | User filters by in-progress/completed                        |
| T17 | E4   | Implement rule-based recommendations service    | P0       | L    | T11, T14   | Dashboard recommendations generated without LLM              |
| T18 | E4   | Add AI feature flag and fallback policy         | P0       | S    | T17        | Production path never requires paid AI                       |
| T19 | E4   | Update dashboard to use free recommender first  | P0       | M    | T17, T18   | Always returns recommendations or meaningful fallback        |
| T20 | E5   | Add Firestore security rules for user isolation | P0       | L    | T10, T11   | User cannot access others' docs                              |
| T21 | E5   | Add input validation for all write operations   | P0       | M    | T10, T11   | Invalid payloads rejected safely                             |
| T22 | E5   | Add caching policy and retry strategy for TMDb  | P1       | M    | None       | Reduced API calls; graceful rate-limit handling              |
| T23 | E5   | Add CI workflow: typecheck, lint, build         | P0       | M    | None       | PR fails on quality gate failures                            |
| T24 | E5   | Add smoke tests for critical routes             | P1       | L    | T23        | Home/search/detail/auth smoke tests pass                     |
| T25 | E6   | Write deployment + rollback runbook             | P1       | S    | T23        | Clear steps to deploy and rollback                           |
| T26 | E6   | Final QA checklist and release candidate pass   | P0       | M    | All P0     | No critical bugs in key flows                                |

## Sprint Plan (Recommended)

### Sprint 1 (Week 1-2)

- T01, T02, T04, T06, T07, T08, T10, T11, T12, T13
- Outcome: user can sign in and save favorites/watched end-to-end.

### Sprint 2 (Week 3-4)

- T03, T05, T14, T15, T16, T17, T18, T19
- Outcome: polished tracking UX + free recommendation engine in production path.

### Sprint 3 (Week 5-6)

- T20, T21, T22, T23, T24, T25, T26
- Outcome: secure, stable, CI-guarded release candidate.

## Definition of Done for Each Ticket

- Feature works on desktop and mobile.
- Handles loading, empty, and error states.
- Typecheck and lint pass locally.
- No console errors in normal user flow.
- If data-related, behavior is user-scoped and rule-compliant.

## Cost-Control Checklist (Must Have)

- Free recommender as default in production.
- Firebase Spark usage alerts enabled.
- TMDb calls cached and deduplicated.
- No heavy background jobs or scheduled workers.
- No large media uploads to your own storage.

## Immediate Next 5 Tickets to Start Today

- T01 Favorites route.
- T02 Watched route.
- T06 Firebase config + env contract.
- T07 Auth integration.
- T10 Favorites repository + action wiring.
