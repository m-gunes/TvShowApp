# TvShowApp

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

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

# Store Design Approach
The store keeps only the raw TV show data from the API. All grouping and sorting logic is handled through computed getters using pure helper functions.
This design choice ensures:

- A strict single source of truth
- Clear separation of responsibilities between data fetching, transformation, and presentation
- Easier testing of pure transformation logic
- And long-term scalability, allowing additional views and filters to be added without changing the core state


### Why tvShows and searchResults Are Separate States

Although tvShows and searchResults share the same data type, they represent different responsibilities.
I intentionally do not overwrite tvShows with search results.
If I did, clearing or resetting the search input would require:

- Re-fetching the full TV show list from the API
- Re-applying the grouping and sorting logic again

By keeping searchResults as a separate state, the main dateset (`tvShows`) remains stable, the search flow stays isolated, and I avoid unnecessary network requests and recomputation. This keeps both the dashboard and the search behavior predictable and efficient.


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
- And keeps horizontal scrolling smooth even with large datasets.


### 2. Debounced Search Input

The search input is debounced using `watchDebounced` to prevent triggering an API request on every keystroke.

This ensures that search requests are only sent after the user pauses typing, which:
- Reduces unnecessary network traffic,
- Improves responsiveness,
- And provides a better overall user experience.
