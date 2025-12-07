<script setup lang="ts">
import Dashboard from '@/components/Dashboard.vue'
</script>

<template>
  <main>
    <header>
      <h2 class="logo">
        <span>T</span>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="20" height="20" />
        <span>{{' '}}Show Explorer</span>
      </h2>
    </header>
    <Dashboard />
  </main>
</template>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  > img {
    margin: 0 5px 0 1px;
  }
}
</style>
