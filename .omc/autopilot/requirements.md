# MusicMap - Requirements Document

**Version:** 1.0 (MVP)
**Date:** 2026-03-30
**Status:** Phase 0 - Analyst Review Complete

---

## 1. Product Overview

MusicMap is a single-page web application that visualizes music genres as an interactive network graph. Users explore relationships between genres (influences, sub-genres, stylistic similarities) by navigating a force-directed node graph. The MVP ships with a pre-built, static genre dataset embedded in the application -- no external API dependency.

**Tech Stack:** TypeScript, React, Vite (bundler), a graph visualization library (e.g., D3.js, react-force-graph, or Cytoscape.js).

---

## 2. Core Features (MVP Must-Haves)

### F1: Genre Network Graph
- Display music genres as nodes in a force-directed network graph.
- Display relationships between genres as edges (lines connecting nodes).
- Each edge has a relationship type: influence, subgenre, or related.
- The graph renders on initial page load with all nodes visible at a default zoom level.
- Nodes are color-coded by top-level genre family (e.g., Rock = red, Electronic = blue, Jazz = green).
- Node size reflects the number of connections (more connections = larger node).

### F2: Node Interaction
- **Click** a node to select it: highlights the node, its direct edges, and its immediate neighbors; dims all other nodes/edges.
- **Hover** over a node to show a tooltip with: genre name, decade of origin, short description (1-2 sentences).
- Clicking empty canvas space (or pressing Escape) deselects the current node and restores the full graph.
- Selected node displays a detail panel (sidebar or overlay) with: genre name, origin decade, description, list of related genres (clickable links back into the graph), and 2-3 representative artists.

### F3: Search and Filter
- A search input field that filters/highlights genres by name (case-insensitive substring match).
- As the user types, matching nodes are highlighted and the graph pans/zooms to fit them.
- If exactly one match remains, auto-select it.
- A filter control to show/hide edges by relationship type (influence / subgenre / related) via checkboxes or toggle buttons.
- A filter control to show/hide genre families (e.g., show only Electronic and Jazz families).

### F4: Graph Navigation
- Zoom in/out via mouse wheel or pinch gesture.
- Pan the graph via click-and-drag on empty canvas space.
- A Reset View button that returns to the default zoom level and centers the graph.
- Zoom controls (+/-) visible on screen for non-trackpad users.

### F5: Responsive Layout
- The application is usable on desktop (1024px+) and tablet (768px+) viewports.
- On narrow viewports (less than 768px), the detail panel collapses to a bottom sheet or modal overlay instead of a sidebar.
- The graph canvas fills the available viewport minus header and any open panels.
---

## 3. User Stories

### US1: Casual Explorer
**As** a music enthusiast, **I want** to see all genres displayed as a connected graph **so that** I can visually discover how genres relate to each other.

**Acceptance Criteria:**
- On page load, the graph renders within 3 seconds on a mid-range device (4-core CPU, 8GB RAM).
- All genre nodes and their edges are visible.
- The graph layout stabilizes (stops animating) within 5 seconds.
- User can distinguish at least 8 different genre family colors.

### US2: Genre Deep-Diver
**As** a user who clicked on a genre node, **I want** to see detailed information about that genre **so that** I can learn about its origins and related genres.

**Acceptance Criteria:**
- Clicking a node opens the detail panel within 200ms.
- The detail panel displays: name, origin decade, description (20-100 words), related genres (clickable), and 2-3 representative artists.
- Clicking a related genre in the detail panel navigates the graph to that genre and updates the panel.
- Pressing Escape or clicking the close button dismisses the panel.

### US3: Genre Searcher
**As** a user looking for a specific genre, **I want** to search by name **so that** I can quickly find it without manually scanning the graph.

**Acceptance Criteria:**
- Typing in the search field produces filtered results within 100ms (after 150ms debounce).
- Matching nodes are visually highlighted (e.g., full opacity while non-matches fade).
- The graph viewport adjusts to fit all matching nodes.
- Clearing the search input restores the full graph view.

### US4: Relationship Explorer
**As** a user interested in genre influences, **I want** to filter edges by relationship type **so that** I can see only influence connections or only sub-genre connections.

**Acceptance Criteria:**
- Toggling a relationship type filter immediately shows/hides the corresponding edges.
- When an edge type is hidden, disconnected nodes (nodes that have no remaining visible edges) remain visible but appear dimmed.
- Filter state persists during the session (not across page reloads).

### US5: Mobile/Tablet User
**As** a user on a tablet, **I want** the app to be usable on my device **so that** I can explore genres on the go.

**Acceptance Criteria:**
- At 768px viewport width, all features are accessible (graph, search, filters, detail panel).
- Touch gestures (pinch-to-zoom, drag-to-pan, tap-to-select) work correctly.
- The detail panel does not obscure more than 50% of the graph canvas on tablet viewports.
---

## 4. Data Model

### 4.1 Genre (Node)

| Field | Type | Required | Description |
|---|---|---|---|
| id | string | Yes | Unique identifier (slug, e.g., post-punk) |
| name | string | Yes | Display name (e.g., Post-Punk) |
| family | string | Yes | Top-level genre family (e.g., Rock) |
| originDecade | string | Yes | Decade of emergence (e.g., 1970s) |
| description | string | Yes | 1-3 sentence description (20-150 words) |
| representativeArtists | string[] | Yes | 2-3 artist names |
| color | string | No | Derived from family at runtime |

### 4.2 Relationship (Edge)

| Field | Type | Required | Description |
|---|---|---|---|
| source | string | Yes | Genre id of the source node |
| target | string | Yes | Genre id of the target node |
| type | enum | Yes | One of: influence, subgenre, related |

### 4.3 Genre Family (derived)

| Field | Type | Required | Description |
|---|---|---|---|
| name | string | Yes | Family name (e.g., Rock, Electronic) |
| color | string | Yes | Hex color code for all genres in this family |

### 4.4 Dataset Scope (MVP)

- **Target:** 50-80 genre nodes.
- **Target:** 100-200 relationship edges.
- **Genre families:** 8-12 top-level families (Rock, Electronic, Jazz, Classical, Hip-Hop, R&B/Soul, Folk/Country, Latin, Metal, Pop, Reggae, Blues).
- **Data source:** Static JSON file(s) bundled with the application. Hand-curated or generated once and committed to the repository.
- **No external API calls** for genre data at runtime.
---

## 5. UI/UX Requirements

### 5.1 Layout

- **Header:** Fixed top bar. Contains app title (MusicMap), search input, and filter toggles.
- **Graph Canvas:** Fills the remaining viewport. This is the primary interaction area.
- **Detail Panel:** Right sidebar (desktop) or bottom sheet (tablet/mobile). Hidden by default. Appears when a node is selected. Width: 300-360px on desktop.
- **Zoom Controls:** Floating overlay on the graph canvas (bottom-right corner). Contains +, -, and Reset buttons.

### 5.2 Visual Design

- Dark theme as default (dark background makes colored nodes pop; reduces eye strain for exploration).
- Nodes: Circles with genre name label. Labels appear on hover or when zoomed in sufficiently (avoid label clutter at full zoom-out).
- Edges: Semi-transparent lines. Color or dash-style varies by relationship type (solid = subgenre, dashed = influence, dotted = related).
- Selected node: Bright border/glow effect. Connected nodes retain full opacity; others fade to 20-30% opacity.
- Smooth transitions/animations for: zoom, pan, selection highlight, panel open/close (duration: 200-300ms).

### 5.3 Interaction Summary

| Action | Input | Result |
|---|---|---|
| Select genre | Click/tap node | Highlight node + neighbors, open detail panel |
| Deselect genre | Click canvas / Esc key | Restore full graph, close detail panel |
| Hover genre | Mouse hover on node | Show tooltip (name, decade, short description) |
| Zoom | Scroll wheel / pinch | Zoom in/out centered on cursor |
| Pan | Click-drag canvas | Move graph viewport |
| Search | Type in search field | Filter and highlight matching genres |
| Filter by relationship | Toggle checkbox | Show/hide edges by type |
| Filter by family | Toggle checkbox | Show/hide genres by family |
| Reset view | Click Reset button | Return to default zoom and center |
---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Target |
|---|---|
| Initial page load (LCP) | Under 3 seconds on 4G connection |
| Graph render (50-80 nodes) | Under 2 seconds after data loads |
| Graph layout stabilization | Under 5 seconds |
| Search response | Under 100ms (after 150ms debounce) |
| Node selection feedback | Under 200ms |
| Smooth frame rate during pan/zoom | 30fps minimum, 60fps target |
| Bundle size (gzipped) | Under 500KB total (JS + CSS + data) |

### 6.2 Browser Support

- Chrome 90+ (Windows, macOS, Android)
- Firefox 90+ (Windows, macOS)
- Safari 15+ (macOS, iOS)
- Edge 90+ (Windows)
- No IE11 support required.

### 6.3 Accessibility

- All interactive elements reachable via keyboard (Tab, Enter, Escape).
- Search input has a visible label or aria-label.
- Detail panel content is screen-reader accessible.
- Color is not the sole differentiator -- node shape or border style should supplement color for genre families (stretch goal for MVP; required post-MVP).
- Minimum contrast ratio: 4.5:1 for text, 3:1 for large text and UI components (WCAG AA).
- Focus indicator visible on all interactive elements.

### 6.4 SEO / Metadata

- Not a priority for MVP (single-page app, no server-side rendering).
- Basic title and meta description tags.

---

## 7. Constraints and Assumptions

### 7.1 Constraints

| ID | Constraint |
|---|---|
| C1 | Single-page application, no backend server. All data is static and bundled. |
| C2 | Tech stack: TypeScript + React + Vite. No Angular, Vue, or other frameworks. |
| C3 | No external API calls for genre data at runtime. Dataset is committed to the repo. |
| C4 | No user authentication or user-generated content in MVP. |
| C5 | Deployment target: static hosting (e.g., GitHub Pages, Netlify, Vercel). No server runtime needed. |
| C6 | Must work offline after initial load (all data is local). |

### 7.2 Assumptions

| ID | Assumption | Validation Method |
|---|---|---|
| A1 | 50-80 nodes is manageable for force-directed layout performance. | Performance test during development with 80 nodes. |
| A2 | A pre-curated dataset is sufficient (no user expects live data). | Defined as MVP scope; user feedback post-launch. |
| A3 | Dark theme is preferred for this type of visualization. | Ship dark-only for MVP; add theme toggle post-MVP. |
| A4 | Genre relationship data can be reasonably hand-curated. | Dataset review during development. |
| A5 | Touch gestures for graph interaction are supported by the chosen library. | Verify during library selection (spike task). |

---

## 8. Out of Scope (Explicitly Excluded from MVP)

- Audio playback or music streaming integration.
- User accounts, login, or saved preferences (beyond session state).
- User-contributed genres or relationships.
- Timeline/historical view (animating genre emergence over decades).
- External API integration (Spotify, Last.fm, MusicBrainz).
- Light theme toggle (MVP is dark-only).
- Server-side rendering or backend.
- Internationalization / localization.
- Analytics or telemetry.
- PWA / service worker (offline via bundled data is sufficient; no install prompt).

---

## 9. Analyst Review

### Missing Questions
1. **Graph library selection** -- Which graph visualization library should be used (D3.js, react-force-graph, Cytoscape.js, sigma.js)? This determines the API surface for all graph interactions, touch support, and performance characteristics. Suggested: Decide during a short spike task before implementation begins.
2. **Dataset authorship** -- Who curates the genre data? Is it generated programmatically from a known source (e.g., Wikipedia genre taxonomy) and then manually refined, or entirely hand-written? This affects data quality and time to produce the dataset.
3. **Edge directionality** -- Are influence edges directional (Genre A influenced Genre B) or bidirectional? This affects arrow rendering and data model. Suggested default: directional for influence, directional for subgenre (parent-to-child), bidirectional for related.
4. **Label density** -- At full zoom-out with 80 nodes, should all labels be visible or only on hover? Full labels will overlap. Suggested: Show labels only when zoomed in past a threshold, or use collision-based label hiding.

### Undefined Guardrails
1. **Maximum dataset size** -- No upper bound defined for nodes/edges. If someone adds 200 genres, performance may degrade. Suggested: Hard cap at 150 nodes and 400 edges for MVP; add virtualization post-MVP.
2. **Description length** -- Genre descriptions have no enforced max length. Suggested: 150-word max per description, validated at build time.
3. **Bundle size budget** -- Suggested: 500KB gzipped total. Graph libraries vary widely (D3 full = 80KB min-gzipped, sigma.js = 50KB, react-force-graph = 30KB + three.js if 3D).

### Scope Risks
1. **3D graph temptation** -- react-force-graph supports 3D rendering, which is visually impressive but dramatically increases complexity (camera controls, occlusion, performance). Prevention: Explicitly require 2D-only for MVP; document 3D as a post-MVP feature.
2. **Dataset perfectionism** -- Curating genre data can become an endless research project. Prevention: Define a fixed list of genre families first, then allocate 4-6 genres per family, and timebox data creation to 2 hours.
3. **Animation polish** -- Graph physics tuning (spring force, repulsion, damping) can consume unbounded time. Prevention: Use library defaults for MVP, document tuning as a post-launch refinement.

### Unvalidated Assumptions
1. **A1: 80-node force layout performance** -- Validate by rendering 80 nodes with the chosen library in a throwaway test before committing to the library.
2. **A5: Touch gesture support** -- Not all graph libraries support pinch-to-zoom and touch-drag natively. Validate during library selection spike.

### Missing Acceptance Criteria
1. **Graph stabilization** -- Stabilizes within 5 seconds needs a definition. Suggested: No node moves more than 1px per frame for 10 consecutive frames.
2. **Search empty state** -- What happens when search matches zero genres? Suggested: Show a No genres found message and dim all nodes.
3. **URL state** -- Should the selected genre be reflected in the URL (e.g., #genre=post-punk) so users can share links? Suggested for MVP: Yes, via URL hash. Low effort, high value.
4. **Keyboard navigation within the graph** -- Can users Tab between nodes? Suggested for MVP: No (graph is mouse/touch only), but search provides keyboard-accessible genre selection.

### Edge Cases
1. **Orphan nodes** -- A genre with no relationships. Should it still appear? Suggested: Yes, displayed as a small isolated node.
2. **Self-referencing edge** -- A genre listed as its own influence. Should be rejected at data validation time.
3. **Duplicate edges** -- Two edges between the same pair with the same type. Data validation should prevent this.
4. **Very long genre names** -- e.g., New Orleans Rhythm and Blues. Labels may overflow. Suggested: Truncate with ellipsis at 25 characters in the graph; show full name in tooltip and detail panel.
5. **Rapid clicks** -- User clicks multiple nodes in quick succession. Suggested: Debounce selection to last click; cancel any in-progress panel transitions.
6. **Browser zoom vs. graph zoom** -- Users may use Ctrl+scroll (browser zoom) instead of scroll (graph zoom). Suggested: Document this as a known behavior; do not attempt to intercept browser zoom.
7. **Search with special characters** -- User types regex-like characters (e.g., R&B). Search should treat input as literal string, not regex.

### Open Questions

- [ ] **Which graph visualization library to use?** -- Determines API, performance ceiling, bundle size, and touch support. Needs a spike task comparing D3-force, react-force-graph-2d, Cytoscape.js, and sigma.js against MVP requirements.
- [ ] **Are influence/subgenre edges directional?** -- Affects visual rendering (arrows vs. lines) and data model (source/target semantics). Suggested default: directional with arrows for influence and subgenre, undirected for related.
- [ ] **Should selected genre be reflected in URL hash?** -- Enables link sharing with minimal effort. Recommend yes for MVP.
- [ ] **What is the genre dataset source?** -- Hand-curated, generated from Wikipedia, or adapted from an existing open dataset? Affects accuracy and time investment.

### Recommendations (Prioritized)

1. **[Critical] Conduct a graph library spike** -- Build a minimal test with 80 nodes, touch gestures, and selection highlighting using 2-3 candidate libraries. This is the single highest-risk technical decision.
2. **[Critical] Define edge directionality** -- This affects the data model schema and visual rendering. Decide before data creation begins.
3. **[High] Timebox dataset creation** -- Define the genre family list, allocate genres per family, and set a 2-hour limit. Perfectionism here delays the entire project.
4. **[High] Add URL hash routing for selected genre** -- Low effort, meaningfully improves shareability.
5. **[Medium] Define search empty state** -- Small UX detail that will be noticed if missing.
6. **[Medium] Add data validation script** -- A simple build-time check for orphan references, duplicate edges, self-references, and description length.
7. **[Low] Plan for accessibility color supplementation** -- Note as post-MVP but design node shapes now to avoid a visual redesign later.
