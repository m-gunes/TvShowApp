<script setup lang="ts">
import { computed, defineProps } from 'vue';
import type { TvShow } from '@/types/tvShowTypes';
import { useVirtualList, useWindowSize } from '@vueuse/core';
import TvShowCard from '@/components/TvShowCard.vue'

const { width } = useWindowSize()

const CARD_WIDTH = computed(() => width.value < 768 ? 166 : 226);

const props = defineProps<{
  genre: string;
  tvShowList: TvShow[]
}>()

const { list, containerProps, wrapperProps } = useVirtualList(
  props.tvShowList,
  { itemWidth: CARD_WIDTH.value }
);
</script>

<template>
  <div class="horizontal-list-row" >
    <h1>{{genre}}</h1>
    <div class="horizontal-list-row__content" v-bind="containerProps" >
      <div v-bind="wrapperProps">
        <TvShowCard v-for="tvShow in list" :key="tvShow.data.id" :tvShow="tvShow.data"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.horizontal-list-row {
  margin-bottom: 16px;
  &__content {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 420px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    white-space: nowrap;
    padding-bottom: 8px;
  }
}

@media (max-width: 767px){
  .horizontal-list-row {
    &__content {
      height: 380px;
    }
  }
}
</style>
