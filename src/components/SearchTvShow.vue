<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watchDebounced } from '@vueuse/core';
import { useTvShowStore } from '@/stores/tvShowStore.ts'

const store = useTvShowStore();
const { searchQuery } = storeToRefs(store)
const { searchTvShow } = store

watchDebounced(searchQuery, async (value) => {
  await searchTvShow(value);
}, { debounce: 500 });

</script>

<template>
  <div class="input-container">
    <input name="search" v-model.trim="searchQuery" type="text" placeholder="Search Tv Show" class="search-input" >
  </div>
</template>

<style scoped>
.input-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
.search-input {
  width: 310px;
  font-size: 16px;
  font-family: inherit;
  padding: 0.45em 0.5em;
  background-color: #fff;
  border: 2px solid #8b8a8b;
  border-radius: 4px;
  transition: width 0.4s ease-in-out;
}
</style>
