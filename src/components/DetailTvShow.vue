<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import type { TvShow } from '@/types/tvShowTypes.ts'
import { fetchShowById } from '@/services/tvShowApi.ts'
const route = useRoute()

const tvShow = ref<TvShow>()

onMounted(async () => {
  const id = Number(route.params.id)
  tvShow.value = await fetchShowById(id)
})
</script>

<template>
  <div class="tv-show-detail">
    <div>
      <img class="tv-show-detail__img" :src="tvShow?.image?.original" :alt="tvShow?.name" />
    </div>
    <div class="tv-show-detail__info">
      <div class="tv-show-detail__name">{{ tvShow?.name }}</div>
      <div>Rating: {{ tvShow?.rating.average }}</div>
      <div>{{ tvShow?.genres.join(', ') }}</div>
      <p class="tv-show-detail__summary" v-html="tvShow?.summary"></p>
    </div>
  </div>
</template>

<style scoped>
.tv-show-detail {
  display: flex;
  width: 100%;
}
.tv-show-detail__img {
  max-width: 500px;
}
.tv-show-detail__info {
  background-color: #f2f2f2;
  color: #181818;
  width: 100%;
  min-width: 320px;
  padding: 20px;
}
.tv-show-detail__name {
  font-weight: bold;
  font-size: 24px;
}
.tv-show-detail__summary {
  margin-top: 20px;
}
</style>
