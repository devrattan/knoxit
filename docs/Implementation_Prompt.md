# Knoxit Production Frontend Implementation Prompt

Act as a **senior UI/UX developer, React frontend architect, and production engineer**.

Your task is to inspect the supplied Knoxit project files and transform the current prototype and frontend bundle into a **beautiful, responsive, accessible, scalable, maintainable, and backend-ready React application**.

Do not provide only suggestions, pseudocode, or a design plan. Inspect the repository, create or modify the required files, run the available validation commands, and deliver working code.

## Files you must inspect first

Read these files before making changes:

1. `knoxit-full-app-preview.jsx`

   * This is the approved interactive visual and behavioural reference.
   * It contains working prototype interactions and mock states.
   * Do not retain its single-file architecture in production.

2. `Knoxit_Complete_Package.zip`

   * Inspect the entire extracted package.
   * Review the production-oriented frontend pages, shared components, mock data, backend routes, Zod schemas, database schema, README files, and build tracker.
   * Do not blindly overwrite an existing application.

3. `Knoxit_User_Journey_Map (1).md`

   * Treat this as the primary source of truth for user flows, screen states, business rules, data touchpoints, and known gaps.

4. The existing repository

   * Inspect its package manager, scripts, router, Tailwind setup, aliases, authentication setup, generated API clients, linting, tests, and conventions.
   * Reuse working infrastructure instead of introducing duplicate libraries.

## Primary objective

Build or refactor the Knoxit frontend so that it:

* Closely preserves the approved dark sports-gaming visual identity.
* Works properly on mobile, tablet, laptop, and desktop.
* Contains real navigation and functioning user interactions.
* Uses reusable components rather than large page-specific blocks.
* Has a predictable state-management architecture.
* Can use mock data today and real backend APIs later without rewriting the UI.
* Handles loading, errors, empty states, validation, permissions, and disabled states.
* Is accessible and keyboard-friendly.
* Is suitable for long-term development by a team.

## Technology requirements

Use the following architecture:

* React with functional components and hooks.
* JavaScript and JSX for new code unless the repository is already TypeScript-first. Do not perform a risky full-repository language conversion merely to change file extensions.
* Redux Toolkit for global application and domain state.
* RTK Query for API requests, caching, mutations, invalidation, request deduplication, and loading/error status.
* Context API only for cross-cutting UI or dependency concerns such as:

  * Theme
  * Feature flags
  * Toasts
  * Modal management
  * Authentication-provider bridge
* Local component state for temporary UI state such as:

  * Open/closed controls
  * Active tabs
  * Form input before submission
  * Hover and disclosure states

Never store the same state in Redux, Context, and component state simultaneously.

Preserve the repository’s current router. For example, if it already uses `wouter`, do not replace it with React Router merely because it is more familiar.

## Recommended project structure

Refactor toward a feature-oriented structure similar to:

```text
src/
  app/
    store.js
    router.jsx
    providers.jsx
    AppShell.jsx
  components/
    ui/
    layout/
    feedback/
    forms/
  features/
    auth/
    account/
    leagues/
    friendsLeagues/
    picks/
    fixtures/
    shop/
    notifications/
    referrals/
    chat/
    splitVote/
  services/
    api/
    realtime/
    storage/
  context/
  hooks/
  utils/
  constants/
  styles/
  mocks/
  tests/
```

Adapt this to the existing repository instead of forcing unnecessary folder churn.

## State-management boundaries

Create clearly separated Redux slices or RTK Query endpoint modules for:

* Auth/session metadata
* Current user profile
* Chip balance and ledger summary
* Competitive leagues
* Friends leagues
* League membership
* Join requests
* Picks and used-team cycles
* Fixtures and results
* Shop items and booster state
* Notification preferences
* Referral data
* Chat messages
* Vault split proposals and votes

Use normalized entities where useful, such as `createEntityAdapter` for leagues, members, requests, and messages.

Derived information must use selectors instead of being duplicated in state. Examples include:

* Active league count
* Locking-soon picks
* Current user’s alive or eliminated status
* Whether the user can manage a league
* Whether a team is unavailable
* Remaining chip balance
* Pending join-request count

## API-ready architecture

Inspect the actual backend route files and validation schemas supplied in the package.

Do not invent endpoint contracts when real contracts already exist.

Implement:

* One configurable API base URL using environment variables.
* A shared RTK Query API layer or integration with the repository’s generated OpenAPI client.
* Endpoint injection by feature where appropriate.
* Consistent request and response transformation.
* Centralized error normalization.
* Cache tags and mutation invalidation.
* Request cancellation when screens unmount.
* A mock API mode that follows the same response shapes as the real API.
* A clear environment switch such as `VITE_USE_MOCK_API`.

Do not place direct `fetch()` calls throughout page components.

If generated API hooks already exist, reuse or wrap them rather than creating a second competing network layer.

Every backend-connected screen must support:

* Initial loading
* Refreshing
* Success
* Empty response
* Validation error
* Permission error
* Network error
* Retry
* Mutation-in-progress
* Mutation success
* Mutation failure

Do not show fake success for functionality that the backend does not yet support.

## Authentication foundation

Authentication is currently a major product gap.

Create a frontend-ready authentication structure with:

* Login screen
* Signup screen
* Forgot-password screen
* Session-loading screen
* Protected-route handling
* Guest-route handling
* Sign-out flow
* Auth provider adapter
* Unauthorized-session recovery
* Post-login redirect support

Do not invent a production token flow if the backend auth contract does not exist.

Keep authentication behind the existing API/session interface so the Neon-backed secure-cookie implementation can evolve without rewriting every page.

Do not store sensitive production tokens in insecure browser storage.

## Responsive UX requirements

The existing fixed phone-frame layout may remain available as a development preview, but it must not be the only production layout.

Support at minimum:

* 320–479 px: compact mobile layout
* 480–767 px: large-phone layout
* 768–1023 px: tablet layout
* 1024 px and above: desktop layout

Behaviour should adapt naturally:

* Bottom navigation on mobile.
* Sidebar or expanded navigation on desktop where appropriate.
* One-column cards on narrow screens.
* Multi-column grids where screen width permits.
* Scrollable tab bars only when necessary.
* Touch targets of at least approximately 44×44 px.
* Safe-area padding for mobile devices.
* No horizontal page overflow.
* Long names and messages must wrap or truncate gracefully.
* Modals must become bottom sheets on small screens when appropriate.

Do not simply enlarge the existing 390 px interface and call it responsive.

## Visual design system

Preserve the current Knoxit identity:

* Near-black and zinc surfaces
* Emerald as the primary action/survival accent
* Violet for friends-league and invite flows
* Amber for chips, rewards, and warnings
* Red for live danger, elimination, and urgent locking states
* Rounded cards
* Subtle borders
* Restrained glows and gradients
* Clear status badges
* Strong numeric hierarchy
* Lucide icons

Create reusable design tokens for:

* Backgrounds and surfaces
* Text hierarchy
* Borders
* Accent colours
* Success, warning, danger, and information states
* Spacing
* Radius
* Shadows
* Typography
* Motion duration
* Z-index layers

Avoid scattering unexplained Tailwind class combinations or hard-coded colours across every component.

Build reusable primitives such as:

* Button
* IconButton
* Input
* Textarea
* Select
* Switch
* Tabs
* Badge
* Avatar
* Card
* StatCard
* LeagueCard
* FixtureRow
* PickCard
* BoosterCard
* Modal
* BottomSheet
* Drawer
* ConfirmationDialog
* Skeleton
* EmptyState
* ErrorState
* Toast
* Countdown
* PageHeader
* SectionHeader

Support standard component states:

* Default
* Hover
* Focus-visible
* Active
* Disabled
* Loading
* Error
* Selected

## Required screens and flows

Preserve and properly implement the existing flows for:

* Home
* My Leagues
* Competitive-league discovery
* Competitive-league join confirmation
* League Detail
* Opponent Profile
* All Survivors
* Picks overview
* Pick Submission
* Fixtures
* Form Guide
* Shop
* Public Friends Leagues
* Friends League request detail
* Join by code
* Create Friends League
* Manage join requests
* Manage Friends League admins
* Profile
* Notification settings
* Refer and Earn
* Invite Friends
* Sign Out
* How to Play
* FAQ
* Terms
* Privacy
* Contact Support
* About

Where a backend or product decision is unresolved, create an honest disabled, coming-soon, or empty state instead of silently pretending the feature works.

## Business rules that must not be changed

Implement these rules exactly:

1. A primary-team win means the user survives.
2. A played draw or loss means elimination, except when a valid Draw Shield protects a draw.
3. The backup pick is not a second chance.
4. The backup pick is used only when the primary fixture has no valid result because it was postponed or abandoned.
5. A team cannot be picked again within the same usage cycle.
6. The team cycle resets only after the entire available team pool has been used.
7. Used teams must appear unavailable in Pick Submission.
8. Competitive-league joining uses chip-denominated entry fees and grows the vault.
9. Friends Leagues have no Knoxit entry fee, no Knoxit vault, and no member limit.
10. Friends League `entryTerms` and join-request `message` values are opaque free text.
11. Never parse these text fields to infer payment, stakes, eligibility, or app behaviour.
12. Joining a public Friends League requires creator or admin approval.
13. Joining through a valid invite code is immediate and bypasses approval.
14. Already-joined users must see an appropriate joined state.
15. Only the original Friends League creator can grant or revoke co-admin status.
16. Co-admins may resolve join requests but cannot remove the creator, delete the league, or promote other admins.
17. Split-the-vault actions appear only when the league satisfies the defined survivor-count rule.
18. A vault split requires unanimous approval.
19. Real-money chip-pack purchasing must remain disabled until a real payment integration exists.
20. Rewarded advertisements must never grant rewards from a simple client-side counter in production.
21. Server verification is required for ad completion.
22. Role- and permission-dependent controls must not appear for unauthorized users.

Centralize these rules in selectors, helpers, validation schemas, or domain services. Do not bury them inside JSX event handlers.

## Forms and validation

Create robust forms for:

* Authentication
* Creating a Friends League
* Joining by code
* Requesting to join
* Submitting primary and backup picks
* Sending a chat message
* Contacting support
* Redeeming referral codes
* Updating notification preferences

Requirements:

* Use existing Zod schemas where available.
* Show field-level validation.
* Prevent duplicate submissions.
* Disable submit buttons only when genuinely necessary.
* Preserve entered data after recoverable API errors.
* Provide success feedback.
* Move focus to the first invalid field.
* Use accessible labels and descriptions.
* Do not rely on placeholder text as the only label.

## Accessibility requirements

Target WCAG 2.1 AA where practical.

Include:

* Semantic headings and landmarks
* Keyboard navigation
* Visible focus indicators
* Proper button elements
* Associated form labels
* Accessible dialog focus management
* Escape-key behaviour
* ARIA labels for icon-only controls
* Accessible live regions for validation and toasts
* Adequate contrast
* Reduced-motion support
* Screen-reader-friendly countdowns
* No colour-only communication of state

## Performance requirements

Implement sensible performance improvements without premature complexity:

* Route-level lazy loading
* Code splitting for larger screens
* Memoized selectors
* Stable list keys
* Image and asset optimization
* Debounced search where applicable
* Pagination or infinite loading for large lists
* Chat-history pagination
* Avoid unnecessary global re-renders
* Avoid placing large arrays or constantly changing objects in Context
* Use `React.memo`, `useMemo`, and `useCallback` only where they solve measurable rerender problems

## Testing requirements

Use the repository’s current test framework. If none exists, prefer Vitest and React Testing Library.

Add tests for critical behaviour, including:

* Used teams cannot be selected
* Backup cannot equal primary
* Backup is used only for `no_result`
* Draw Shield handling
* Join-by-code validation
* Already-joined state
* Friends League request submission
* Approve and decline request flows
* Friends League permissions
* Chip-balance changes
* Insufficient-chip handling
* Notification updates
* Loading, error, and empty states
* Protected-route behaviour
* Responsive navigation behaviour

Use MSW or an equivalent API-mocking layer for integration tests where appropriate.

## Implementation process

Follow this sequence:

1. Inspect all supplied files and the existing repository.
2. Identify duplicate, obsolete, prototype-only, and production-ready code.
3. Produce a concise architecture audit.
4. Create the application store and provider structure.
5. Create design tokens and reusable UI primitives.
6. Establish routing and responsive layout.
7. Create the API and mock-data boundary.
8. Migrate pages feature by feature.
9. Connect interactions to Redux Toolkit and RTK Query.
10. Add loading, empty, error, permission, and disabled states.
11. Add tests.
12. Run the available lint, test, and production-build commands.
13. Fix errors introduced by the implementation.
14. Provide a final summary of changed files, commands run, test results, and remaining backend blockers.

Do not stop after the audit or implementation plan. Continue with the code unless a genuinely missing external dependency makes execution impossible.

## Non-negotiable constraints

* Do not place the production application in one giant component.
* Do not duplicate the entire prototype file inside the production source.
* Do not blindly overwrite the existing `App` file.
* Do not replace working repository infrastructure without justification.
* Do not hard-code API URLs inside components.
* Do not use mock data directly inside production page components.
* Do not invent backend responses.
* Do not fake payments, ad verification, results processing, or authentication.
* Do not change approved business rules merely to simplify implementation.
* Do not parse Friends League Entry Terms or request messages.
* Do not expose controls the current user is not allowed to use.
* Do not leave important buttons visually active when they have no action.
* Do not use `window.alert` for normal application feedback.
* Do not suppress TypeScript, ESLint, or runtime errors with unsafe workarounds.
* Do not declare the work complete while the app has console errors or broken navigation.

## Definition of done

The frontend is complete for the selected scope when:

* It runs successfully using the repository’s normal development command.
* Its production build completes successfully.
* Navigation works through all implemented flows.
* Interactive controls have real state transitions.
* Layouts work from 320 px mobile to desktop widths.
* No screen depends directly on the large prototype component.
* Reusable visual patterns are extracted into shared components.
* Redux, Context, and local state have clear non-overlapping responsibilities.
* Mock data can be replaced with real APIs through the service layer.
* Loading, error, empty, permission, and disabled states are implemented.
* Forms are validated and accessible.
* Business rules are covered by tests.
* There are no avoidable console warnings or runtime errors.
* Remaining backend-dependent work is clearly documented without being misrepresented as functional.

Begin by inspecting the files and repository. Then implement the application rather than merely describing what should be built.
