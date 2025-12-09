# TvShowApp

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Runtime Requirements
This project was developed and tested with:
- **Node.js:** 23.9.0
- **npm:** 11.6.2

# Store Design Approach
The store keeps only the raw TV show data from the API. All grouping and sorting logic is handled through computed getters using pure helper functions.
This design choice ensures:

- A strict single source of truth
- Clear separation of responsibilities between data fetching, transformation, and presentation
- Easier testing of pure transformation logic
- Long-term scalability, allowing additional views and filters to be added without changing the core state

In addition, the same `tvShows` dataset is also reused by the **Detail Page** through a cache-first strategy. When navigating to a detail view, the store is checked first before making a new API request. If the show already exists in the store, it is displayed instantly. This avoids unnecessary network requests and improves overall performance.


### Why tvShows and searchResults Are Separate States

Although tvShows and searchResults share the same data type, they represent different responsibilities.
I intentionally do not overwrite tvShows with search results.
If I did, clearing or resetting the search input would require:

- Re-fetching the full TV show list from the API
- Re-applying the grouping and sorting logic again

By keeping `searchResults` as a separate state, the main dateset (`tvShows`) remains stable, the search flow stays isolated, and I avoid unnecessary network requests and recomputation. This keeps both the dashboard, the search behavior, and the detail page caching predictable and efficient.


### Search API Result Mapping

The TVMaze search endpoint returns items in the shape:

```ts
type TvShowSearchItem = {
  score: number;
  show: TvShow;
};
```
At the API layer, I immediately map this response to the domain model:

```ts
return data.map((item: TvShowSearchItem) => item.show);
```

This keeps the store and components working only with the `TvShow` type, decoupling the application from the raw API response shape.
If displaying the `score` becomes necessary, I would adjust the `searchResults` state structure and continue exposing the formatted results to the UI through a computed getter.


# Performance Optimizations 
To ensure smooth performance and scalability, the following optimizations were applied:

### 1. Virtualized Horizontal Lists

After grouping TV shows by genre, some categories may contain dozens of items, while only a few are visible in the horizontal viewport at a time.
To avoid rendering all items unnecessarily, **list virtualization** is implemented using `useVirtualList`.

**Only the visible TV shows** (plus a small buffer) are rendered in the DOM, which:
- Significantly reduces the number of DOM nodes,
- Improves rendering performance,
- Keeps horizontal scrolling smooth even with large datasets.


Additionally, **to speed up the initial page load**, images that are not immediately visible on the screen are loaded using **native lazy loading**:
```html
<img loading="lazy" alt="" />
```
This prevents unnecessary image downloads, reduces bandwidth usage, and improves perceived performance, especially on slower connections.


### 2. Debounced Search Input

The search input is debounced using `watchDebounced` to prevent triggering an API request on every keystroke.

This ensures that search requests are only sent after the user pauses typing, which:
- Reduces unnecessary network traffic,
- Improves responsiveness,
- Provides a better overall user experience.


# Accessibility

TV show cards are implemented using semantic `<RouterLink>` elements instead of clickable `<div>`s.
This ensures full keyboard accessibility using `Tab` and `Enter`, improves screen reader support,
and aligns with WCAG guidelines such as:

- WCAG 2.1.1 – Keyboard Accessibility
- WCAG 2.4.7 – Focus Visible
- WCAG 1.1.1 – Non-text Content

Custom `:focus-visible` styles are added to clearly indicate the active element during keyboard navigation.