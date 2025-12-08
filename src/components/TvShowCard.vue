<script setup lang="ts">
import type { TvShow } from '@/types/tvShowTypes.ts'

defineProps<{
  tvShow: TvShow
}>()
</script>

<template>
  <RouterLink class="tv-show-card" :to="{ name: 'detail', params: { id: tvShow.id } }">
    <img
      v-if="tvShow?.image?.medium"
      loading="lazy"
      :src="tvShow?.image?.medium"
      :alt="tvShow.name"
    />

    <div v-else class="tv-show-card__no-img">No image</div>

    <div class="tv-show-card__name">{{ tvShow.name }}</div>
    <div>Rating: <strong>{{ tvShow.rating.average }}</strong></div>
    <div>{{ tvShow.genres.join(' | ') }}</div>
  </RouterLink>
</template>

<style scoped lang="scss">
.tv-show-card {
  width: 226px; /* img -> 210px + padding -> 16px */
  margin: 0 12px 12px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  text-wrap: auto;
  color: var(--color-text);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  > img {
    width: 100%;
  }
  &__name {
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__no-img {
    width: 100%;
    height: 292px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  &:focus-visible {
    outline: 2px solid #1976d2;
    outline-offset: 2px;
  }
}

@media (max-width: 767px) {
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
