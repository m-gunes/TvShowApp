<script setup lang="ts">
import { storeToRefs } from 'pinia'
import HorizontalListRow from '@/components/HorizontalListRow.vue'
import TvShowCard from '@/components/TvShowCard.vue'
import { onMounted } from 'vue'
import { useTvShowStore } from '@/stores/tvShowStore.ts'
import SearchTvShow from '@/components/SearchTvShow.vue'
import TvShowCardSkeleton from '@/components/TvShowCardSkeleton.vue'

const tvShowsStore = useTvShowStore()
const { loadTvShows } = tvShowsStore
const { loading, error, noSearchResult, hasSearchResults, groupedTvShows, searchResults } =
  storeToRefs(tvShowsStore)

onMounted(async () => {
  await loadTvShows()
})
</script>

<template>
  <SearchTvShow />

  <template v-if="loading">
    <TvShowCardSkeleton />
  </template>

  <h2 v-else-if="error">{{ error }}</h2>

  <h2 v-else-if="noSearchResult">There is no result!</h2>

  <HorizontalListRow
    v-else-if="!hasSearchResults"
    v-for="(tvShowList, name) in groupedTvShows"
    :key="name"
    :genre="name"
    :tvShowList="tvShowList"
  />

  <div v-else class="search-results">
    <TvShowCard v-for="item in searchResults" :key="item.id" :tvShow="item" />
  </div>
</template>

<style scoped>
.search-results {
  display: flex;
  width: 100%;
  height: 100%;
  align-content: flex-start;
  flex-wrap: wrap;
}
</style>
