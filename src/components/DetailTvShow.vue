<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import type { TvShow } from '@/types/tvShowTypes.ts'
import { fetchShowById } from '@/services/tvShowApi.ts'
import { useDateFormat } from '@/components/composables/useDateFormat.ts'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'

const route = useRoute()
const router = useRouter()

const tvShow = ref<TvShow | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const { formatDate } = useDateFormat()

const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push({ name: 'home' })
}

const loadTvShowById = async () => {
  const id = Number(route.params.id)

  if (Number.isNaN(id)) {
    error.value = 'Invalid show id'
    return
  }

  try {
    loading.value = true
    error.value = null
    tvShow.value = await fetchShowById(id)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load TV show!'
  } finally {
    loading.value = false
  }
}

onMounted(loadTvShowById)
</script>

<template>
  <button class="back-button" @click="goBack">
    <IconArrowLeft class="back-icon" /> <strong>Back</strong>
  </button>

  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>

  <div v-else class="tv-show-detail">
    <div class="tv-show-detail__img">
      <img v-if="tvShow?.image?.original" :src="tvShow?.image?.original" :alt="tvShow?.name" />
      <div v-else class="tv-show-detail__img--no-img">No image</div>
    </div>
    <div class="tv-show-detail__info">
      <div class="tv-show-detail__info--name">{{ tvShow?.name }}</div>
      <div>
        Rating: <strong>{{ tvShow?.rating.average }}</strong>
      </div>
      <div>{{ tvShow?.genres.join(' | ') }}</div>
      <p class="tv-show-detail__info--summary" v-html="tvShow?.summary"></p>

      <div class="tv-show-detail__info--box">
        <div><strong>Status:</strong>{{ tvShow?.status }}</div>
        <div><strong>Show Type:</strong>{{ tvShow?.type }}</div>
        <div>
          <strong>Network:</strong> {{ tvShow?.network?.name }} -
          {{ tvShow?.network?.country.name }}
        </div>
        <div>
          <strong>Official site:</strong>
          <a v-if="tvShow?.officialSite" target="_blank" :href="tvShow?.officialSite">Link</a>
          <span v-else>-</span>
        </div>
        <div><strong>Language:</strong> {{ tvShow?.language }}</div>
        <div><strong>Premiered:</strong> {{ formatDate(tvShow?.premiered) }}</div>
        <div><strong>End Date:</strong> {{ formatDate(tvShow?.ended) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.back-button {
  display: flex;
  align-items: center;
  margin: 16px 0;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
  border: 1px solid #ccc;
  > .back-icon {
    width: 24px;
  }
}

.tv-show-detail {
  display: flex;
  width: 100%;
  &__img {
    > img {
      max-width: 500px;
    }
    &--no-img {
      width: 500px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &__info {
    background-color: #f2f2f2;
    color: #181818;
    width: 100%;
    padding: 20px;
    &--name {
      font-weight: bold;
      font-size: 24px;
    }
    &--summary {
      margin: 20px 0;
    }
    &--box {
      border: 1px solid #404040;
      padding: 12px;
      border-radius: 4px;
      div {
        margin-bottom: 8px;
      }
      strong {
        width: 120px;
        display: inline-block;
      }
    }
  }
}

@media (max-width: 768px) {
  .tv-show-detail {
    &__img {
      width: 100%;
      text-align: center;
      > img {
        width: 100%;
      }
      &--no-img {
        width: 100%;
        height: 100px;
      }
    }
    flex-direction: column;
    &__info {
      width: 100%;
    }
  }
}
</style>
