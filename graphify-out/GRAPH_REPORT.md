# Graph Report - TN-PUBLIC-PULSE  (2026-08-19)

## Corpus Check
- 42 files · ~253,894 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 245 nodes · 449 edges · 13 communities (10 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c9bab88b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Run and deploy your AI Studio app

## God Nodes (most connected - your core abstractions)
1. `handleFirestoreError()` - 38 edges
2. `useLanguage()` - 15 edges
3. `compilerOptions` - 15 edges
4. `parties` - 9 edges
5. `ResultsPage()` - 9 edges
6. `AdminPage()` - 8 edges
7. `HomePage()` - 7 edges
8. `scripts` - 6 edges
9. `ErrorBoundary` - 6 edges
10. `submitVote()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `HomePage()` --references--> `react`  [EXTRACTED]
  src/pages/HomePage.tsx → package.json
- `ResultsPage()` --references--> `react`  [EXTRACTED]
  src/pages/ResultsPage.tsx → package.json
- `Countdown()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/Countdown.tsx → src/context/LanguageContext.tsx
- `Footer()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/Footer.tsx → src/context/LanguageContext.tsx
- `LivePulseBanner()` --calls--> `subscribeToOverallResults()`  [EXTRACTED]
  src/components/LivePulseBanner.tsx → src/services/voteService.ts

## Import Cycles
- None detected.

## Communities (13 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (43): CommentItem, CommentSection, AdminPage(), BlogDetailPage(), BlogListPage(), GamePage(), Question, questions (+35 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (43): better-sqlite3, canvas-confetti, dotenv, express, firebase, @google/genai, html-to-image, lucide-react (+35 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (21): LivePulseBanner(), PartyImageProps, ShareableResultCardProps, allConstituencies, constituenciesByDistrict, districts, imageModules, parties (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (26): autoprefixer, vite, devDependencies, autoprefixer, tailwindcss, tsx, @types/express, @types/node (+18 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (9): ErrorBoundary, Props, State, LanguageProvider(), AffiliateProduct, products, NotFoundPage(), PrivacyPolicyPage() (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.19
Nodes (15): Banner(), Countdown(), Footer(), Header(), Layout(), LanguageContext, LanguageContextType, useLanguage() (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (18): DOM, DOM.Iterable, ES2022, compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.36
Nodes (8): ForumPage(), TopicDetailPage(), ForumTopic, getForumTopic(), postForumReply(), postForumTopic(), subscribeToForumTopics(), upvoteForumTopic()

### Community 8 - "Community 8"
Cohesion: 0.47
Nodes (3): BattleArena(), postShout(), subscribeToShouts()

## Knowledge Gaps
- **75 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 1` to `Community 3`?**
  _High betweenness centrality (0.395) - this node is a cross-community bridge._
- **Why does `react` connect `Community 1` to `Community 2`, `Community 5`?**
  _High betweenness centrality (0.340) - this node is a cross-community bridge._
- **Why does `ResultsPage()` connect `Community 2` to `Community 1`, `Community 5`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09142857142857143 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11363636363636363 - nodes in this community are weakly interconnected._