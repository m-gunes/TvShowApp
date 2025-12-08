<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watchDebounced } from '@vueuse/core'
import { useTvShowStore } from '@/stores/tvShowStore.ts'
import IconClose from '@/components/icons/IconClose.vue'
import IconMagnify from '@/components/icons/IconMagnify.vue'

const store = useTvShowStore()
const { searchQuery } = storeToRefs(store)
const { searchTvShow } = store

watchDebounced(
  searchQuery,
  async (value) => {
    await searchTvShow(value)
  },
  { debounce: 500 },
)
</script>

<template>
  <div class="input-container">
    <div class="input-wrapper">
      <IconMagnify class="icon search-icon" />
      <input
        name="search"
        v-model.trim="searchQuery"
        type="text"
        placeholder="Search Tv Show"
        class="search-input"
      />
      <IconClose v-if="searchQuery" class="icon clear-icon" @click="searchQuery = ''" />
    </div>
  </div>
</template>

<style scoped>
.input-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.input-wrapper {
  width: 310px;
  position: relative;
}

.search-input {
  width: 100%;
  font-size: 16px;
  padding: 0.45em 1.8em;
  background-color: #fff;
  border: 2px solid #8b8a8b;
  border-radius: 4px;
}

.icon {
  position: absolute;
  width: 22px;
  top: 7px;
}

.search-icon {
  left: 5px;
}

.clear-icon {
  right: 5px;
  cursor: pointer;
}
</style>
