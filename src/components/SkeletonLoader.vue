<script setup lang="ts">

defineProps<{
  isDashboard?: boolean;
}>()

</script>

<template>
  <div class="skeleton">
    <template v-if="isDashboard">
      <div v-for="i in 10" :key="i" class="skeleton__card">
        <div class="skeleton__card--img"></div>
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--small"></div>
      </div>
    </template>
    <template v-else>
      <div class="skeleton__generic"></div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  align-content: flex-start;
  flex-wrap: wrap;
  &__card {
    width: 226px;
    margin: 0 12px 12px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    &--img {
      width: 100%;
      height: 295px;
      border-radius: 4px;
      background-color: #404040;
      margin-bottom: 8px;
      animation: pulse-bg 1s infinite;
    }
  }

  &__generic {
    position: fixed;
    inset: 60px 20px;
    background-color: #404040;
    animation: pulse-bg 1s infinite;
  }
}

.skeleton-line {
  height: 10px;
  border-radius: 999px;
  background: #404040;
  margin-bottom: 6px;
  animation: pulse-bg 1s infinite;
}

.skeleton-line--title {
  width: 70%;
}

.skeleton-line--small {
  width: 40%;
}

@keyframes pulse-bg {
  0% {
    background-color: #404040;
  }
  50% {
    background-color: #3a3a3a;
  }
  100% {
    background-color: #404040;
  }
}
</style>
