// src/__tests__/stores/tvShowStore.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTvShowStore } from '@/stores/tvShowStore'
import * as api from '@/services/tvShowApi'
import type { TvShow } from '@/types/tvShowTypes'

// Small factory helper to create valid TvShow objects for tests
const makeShow = (overrides: Partial<TvShow> = {}): TvShow => ({
  id: 1,
  name: 'Test Show',
  genres: [],
  rating: { average: null },
  image: { medium: '', original: '' },
  summary: '',
  status: 'Running',
  type: 'Scripted',
  network: null,
  officialSite: null,
  language: 'English',
  premiered: null,
  ended: null,
  ...overrides,
})

describe('tvShowStore', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance before each test
    setActivePinia(createPinia())

    // Reset all mocks between tests
    vi.restoreAllMocks()
  })

  it('loadTvShows fills groupedTvShows and handles loading state', async () => {
    const mockShows: TvShow[] = [
      makeShow({ id: 1, name: 'Drama 1', genres: ['Drama'], rating: { average: 7 } }),
      makeShow({ id: 2, name: 'Comedy 1', genres: ['Comedy'], rating: { average: 8 } }),
      makeShow({ id: 3, name: 'Drama 2', genres: ['Drama'], rating: { average: 9 } }),
    ]

    // Mock the API call
    const fetchSpy = vi.spyOn(api, 'fetchShows').mockResolvedValue(mockShows)

    const store = useTvShowStore()

    // Initial loading state should be false
    expect(store.loading).toBe(false)

    const promise = store.loadTvShows()

    // Loading should be true while the request is in progress
    expect(store.loading).toBe(true)

    await promise

    // API should be called once
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    // Loading should be stopped after request finishes
    expect(store.loading).toBe(false)

    // Error should remain null on success
    expect(store.error).toBeNull()

    // Validate grouped and sorted result via getter
    const groups = store.groupedTvShows
    expect(Object.keys(groups)).toContain('Drama')
    expect(Object.keys(groups)).toContain('Comedy')
    expect(groups.Drama).toHaveLength(2)
    expect(groups.Comedy).toHaveLength(1)

    // Verify that Drama group is sorted by rating descending
    expect(groups.Drama).toBeDefined()
    expect(groups.Drama!.map((s) => s.id)).toEqual([3, 1])
  })

  it('loadTvShows sets error on failure and stops loading', async () => {
    // Mock API rejection
    vi.spyOn(api, 'fetchShows').mockRejectedValue(new Error('Network error'))

    const store = useTvShowStore()

    await store.loadTvShows()

    // Loading should always stop after the request
    expect(store.loading).toBe(false)

    // Error message should be set
    expect(store.error).toBe('Network error')
  })

  it('searchTvShow with short query resets search state and does not call API', async () => {
    const searchSpy = vi.spyOn(api, 'searchShow').mockResolvedValue([])

    const store = useTvShowStore()

    // Pre-fill the state to verify reset behavior
    store.searchResults = [makeShow({ id: 99 })]
    store.noSearchResult = true
    store.error = 'previous error'

    // Query shorter than MIN_QUERY_LENGTH
    await store.searchTvShow('a')

    // API should not be called
    expect(searchSpy).not.toHaveBeenCalled()

    // Search-related state should be reset
    expect(store.searchResults).toEqual([])
    expect(store.noSearchResult).toBe(false)
    expect(store.error).toBeNull()

    // Loading should remain false
    expect(store.loading).toBe(false)
  })

  it('searchTvShow stores results and clears noSearchResult on success', async () => {
    const mockSearchResults: TvShow[] = [
      makeShow({ id: 10, name: 'Girls' }),
      makeShow({ id: 11, name: 'Gilmore Girls' }),
    ]

    // Mock successful search response
    const searchSpy = vi.spyOn(api, 'searchShow').mockResolvedValue(mockSearchResults)

    const store = useTvShowStore()

    const promise = store.searchTvShow('girls')

    // Loading should be true while searching
    expect(store.loading).toBe(true)

    await promise

    // Verify API call
    expect(searchSpy).toHaveBeenCalledWith('girls')

    // Validate state after successful search
    expect(store.loading).toBe(false)
    expect(store.searchResults).toEqual(mockSearchResults)
    expect(store.noSearchResult).toBe(false)
    expect(store.error).toBeNull()
    expect(store.hasSearchResults).toBe(true)
  })

  it('searchTvShow sets noSearchResult when API returns empty array', async () => {
    // Mock empty search response
    vi.spyOn(api, 'searchShow').mockResolvedValue([])

    const store = useTvShowStore()

    await store.searchTvShow('unknown-show')

    expect(store.loading).toBe(false)
    expect(store.searchResults).toEqual([])
    expect(store.noSearchResult).toBe(true)
  })

  it('searchTvShow sets error on failure and resets loading', async () => {
    // Mock API error
    vi.spyOn(api, 'searchShow').mockRejectedValue(new Error('Search failed'))

    const store = useTvShowStore()

    await store.searchTvShow('girls')

    expect(store.loading).toBe(false)
    expect(store.error).toBe('Search failed')

    // noSearchResult should not be set when an error occurs
    expect(store.noSearchResult).toBe(false)
  })
})
