import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { TvShow } from '@/types/tvShowTypes.ts'
import { fetchAllShows, searchShow } from '@/services/tvShowApi.ts'
import { groupByGenre, sortByRating } from '@/utils/tvShowUtils.ts'

const MIN_QUERY_LENGTH = 2;
const ERROR_MESSAGE = "Something went wrong";

export const useTvShowStore = defineStore('tvShows', () => {
  // state
  const tvShows = ref<TvShow[]>([]);
  const searchResults = ref<TvShow[]>([]);
  const searchQuery = ref<string>("");
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const noSearchResult = ref<boolean>(false);

  // helpers
  const resetSearchState = () => {
    searchResults.value = [];
    noSearchResult.value = false;
    error.value = null;
  }

  // actions
  async function searchTvShow(query: string) {

    if (query.length < MIN_QUERY_LENGTH) {
      resetSearchState()
      return;
    }

    loading.value = true;

    try {
      const res = await searchShow(query);
      if (res.length > 0) {
        searchResults.value = res;
        noSearchResult.value = false;
      }
      else noSearchResult.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : ERROR_MESSAGE;
    } finally {
      loading.value = false;
    }
  }

  async function LoadTvShows() {
    try {
      loading.value = true;
      tvShows.value = await fetchAllShows();
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : ERROR_MESSAGE;
    } finally {
      loading.value = false;
    }
  }

  // getters
  const groupedTvShows = computed(() => {
    const map = groupByGenre(tvShows.value);
    return sortByRating(map);
  });
  const hasSearchResults = computed(() => searchResults.value.length > 0);

  return {
    LoadTvShows,
    searchTvShow,
    groupedTvShows,
    searchResults,
    hasSearchResults,
    searchQuery,
    noSearchResult,
    loading,
    error,
  }
})

