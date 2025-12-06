import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { TvShow } from '@/types/tvShowTypes.ts'
import { fetchAllShows, searchShow } from '@/services/tvShowApi.ts'

const MIN_QUERY_LENGTH = 2;

export const useTvShowStore = defineStore('tvShows', () => {

  // state
  const groupedTvShows = ref<Record<string,TvShow[]>>({});
  const searchResults = ref<TvShow[]>([]);
  const searchQuery = ref<string>("");
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const noSearchResult = ref<boolean>(false);

  // actions
  const searchTvShow = async (query: string) => {

    if (query.length < MIN_QUERY_LENGTH) {
      searchResults.value = [];
      noSearchResult.value = false;
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
      error.value = err instanceof Error ? err.message : "Something went wrong";
    } finally {
      loading.value = false;
    }
  }

  const groupByGenre = (tvShowList: TvShow[]) => {
    const map: Record<string, TvShow[]> = {};
    const uncategorized: TvShow[] = [];

    tvShowList.forEach((show) => {
      if (!show.genres || show.genres.length === 0) {
        uncategorized.push(show);
        return;
      }

      show.genres.forEach((genre) => {
        if (!map[genre]) map[genre] = [];
        map[genre].push(show);
      });
    });

    if (uncategorized.length > 0)
      map["Uncategorized"] = uncategorized;

    return map;
  }

  const sortByRating = (map: Record<string, TvShow[]>) => {
    const sortByRatingFunc = (a:TvShow, b:TvShow) => (b.rating.average ?? 0) - (a.rating.average ?? 0);
    Object.keys(map).forEach((genre) => map[genre]?.sort(sortByRatingFunc));
  }

  async function LoadTvShows() {
    try {
      loading.value = true;
      const res = await fetchAllShows();
      const map = groupByGenre(res);
      sortByRating(map);
      groupedTvShows.value = map;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : "Something went wrong";
    } finally {
      loading.value = false;
    }
  }

  // getters
  const getGroupedTvShowByGenre = computed(() => groupedTvShows.value);
  const hasSearchResults = computed(() => searchResults.value.length > 0);


  return {
    LoadTvShows,
    searchResults,
    searchTvShow,
    groupedTvShows,
    getGroupedTvShowByGenre,
    hasSearchResults,
    searchQuery,
    noSearchResult,
    loading,
    error,
  }
})

// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }
//
//   return { count, doubleCount, increment }
// })

