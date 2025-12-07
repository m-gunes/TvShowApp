<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { TvShow } from '@/types/tvShowTypes.ts'

const router = useRouter();

defineProps<{
  tvShow: TvShow
}>();

const goToDetail = (id: number) =>
  router.push({ name: 'detail', params: { id } })

</script>

<template>
  <div class="tv-show-card" @click="goToDetail(tvShow.id)">
    <img
      v-if="tvShow?.image?.medium"
      :src="tvShow?.image?.medium"
      :alt="tvShow.name"
    />
    <div v-else class="tv-show-card__no-img">No image</div>

    <div class="tv-show-card-name">{{ tvShow.name }}</div>
    <div>Rating: {{ tvShow.rating.average }}</div>
    <div>{{ tvShow.genres.join(' | ') }}</div>
  </div>
</template>

<style scoped lang="scss">

.tv-show-card {
  width: 226px; /* img -> 210px + padding -> 16px */
  margin: 0 12px 12px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  > img {
    width: 100%;
  }
  &__no-img {
    width: 100%;
    height: 292px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.tv-show-card-name {
  font-weight: bold;
}

@media (max-width: 767px){
  .tv-show-card {
    width: 166px;
    &__no-img {
      height: 208px;
    }
    > div {
      text-wrap: auto;
    }
  }
}

</style>
