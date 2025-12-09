import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { TvShow } from '@/types/tvShowTypes.ts'
import { fetchShows, searchShow } from '@/services/tvShowApi.ts'
import { groupByGenre, sortByRating } from '@/utils/tvShowUtils.ts'

const MIN_QUERY_LENGTH = 2
const ERROR_MESSAGE = 'Something went wrong'

export const useTvShowStore = defineStore('tvShows', () => {
  // state
  const tvShows = ref<TvShow[]>([])
  const searchResults = ref<TvShow[]>([])
  const searchQuery = ref<string>('')
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const noSearchResult = ref<boolean>(false)

  // actions
  async function searchTvShow() {
    if (searchQuery.value.length < MIN_QUERY_LENGTH) {
      searchResults.value = []
      noSearchResult.value = false
      error.value = null
      return
    }

    loading.value = true
    error.value = null
    noSearchResult.value = false

    try {
      const res = await searchShow(searchQuery.value)
      searchResults.value = res
      noSearchResult.value = res.length === 0
    } catch (err) {
      error.value = err instanceof Error ? err.message : ERROR_MESSAGE
    } finally {
      loading.value = false
    }
  }

  async function loadTvShows() {
    try {
      loading.value = true
      error.value = null
      tvShows.value = await fetchShows()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : ERROR_MESSAGE
    } finally {
      loading.value = false
    }
  }

  // getters
  const groupedTvShows = computed(() => {
    const map = groupByGenre(tvShows.value)
    return sortByRating(map)
  })

  const hasSearchResults = computed(() => searchResults.value.length > 0)

  const getTvShowById = (id: number) => tvShows.value.find((s) => s.id === id)

  return {
    loadTvShows,
    searchTvShow,
    groupedTvShows,
    hasSearchResults,
    getTvShowById,
    searchResults,
    searchQuery,
    noSearchResult,
    loading,
    error,
  }
})
