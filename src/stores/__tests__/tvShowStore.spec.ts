import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTvShowStore } from '@/stores/tvShowStore'
import { fetchShows, searchShow } from '@/services/tvShowApi'
import { createTvShow } from '@/testUtil/createTvShow.ts'

// ---- mocks ----
vi.mock('@/services/tvShowApi', () => ({
  fetchShows: vi.fn(),
  searchShow: vi.fn(),
}))

const mockFetchShows = fetchShows as Mock
const mockSearchShow = searchShow as Mock

describe('tvShowStore actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  // ---------------- loadTvShows ----------------

  it('loadTvShows success -> loads shows and clears error', async () => {
    const store = useTvShowStore()
    const shows = [createTvShow({ id: 1 }), createTvShow({ id: 2})]
    mockFetchShows.mockResolvedValueOnce(shows)

    await store.loadTvShows()

    expect(mockFetchShows).toHaveBeenCalledOnce()
    expect(store.error).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('loadTvShows error -> sets error state', async () => {
    const store = useTvShowStore()
    mockFetchShows.mockRejectedValueOnce(new Error('Fetch failed'))

    await store.loadTvShows()

    expect(store.error).toBe('Fetch failed')
    expect(store.loading).toBe(false)
  })

  // ---------------- searchTvShow ----------------

  it('searchTvShow ignores short query (<2)', async () => {
    const store = useTvShowStore()
    store.searchQuery = 'a'
    store.searchResults = [createTvShow()]
    store.noSearchResult = true
    store.error = 'old error'

    await store.searchTvShow()

    expect(mockSearchShow).not.toHaveBeenCalled()
    expect(store.searchResults).toEqual([])
    expect(store.noSearchResult).toBe(false)
    expect(store.error).toBeNull()
  })

  it('searchTvShow success -> sets results', async () => {
    const store = useTvShowStore()
    const results = [createTvShow({ id: 10 })]
    store.searchQuery = 'mg'
    mockSearchShow.mockResolvedValueOnce(results)

    await store.searchTvShow()

    expect(mockSearchShow).toHaveBeenCalledWith('mg')
    expect(store.searchResults).toEqual(results)
    expect(store.noSearchResult).toBe(false)
    expect(store.loading).toBe(false)
  })

  it('searchTvShow empty result -> sets noSearchResult true', async () => {
    const store = useTvShowStore()
    store.searchQuery = 'xyz'
    mockSearchShow.mockResolvedValueOnce([])

    await store.searchTvShow()

    expect(store.searchResults).toEqual([])
    expect(store.noSearchResult).toBe(true)
    expect(store.loading).toBe(false)
  })

  it('searchTvShow error -> sets error state', async () => {
    const store = useTvShowStore()
    store.searchQuery = 'dr'
    mockSearchShow.mockRejectedValueOnce(new Error('Search failed'))

    await store.searchTvShow()

    expect(store.error).toBe('Search failed')
    expect(store.loading).toBe(false)
  })
})
