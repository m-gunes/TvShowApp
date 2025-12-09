// src/components/__tests__/SearchTvShow.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useTvShowStore } from '@/stores/tvShowStore'
import SearchTvShow from '@/components/SearchTvShow.vue'

describe('SearchTvShow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('binds input value to store.searchQuery', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })

    const wrapper = mount(SearchTvShow, {
      global: {
        plugins: [pinia],
      },
    })

    const store = useTvShowStore()
    const input = wrapper.get('input')

    await input.setValue('Breaking bad')

    expect(store.searchQuery).toBe('Breaking bad')
  })

  it('shows clear icon when there is a search query and clears on click', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })

    const wrapper = mount(SearchTvShow, {
      global: {
        plugins: [pinia],
      },
    })

    const store = useTvShowStore()

    store.searchQuery = 'test'
    await wrapper.vm.$nextTick()

    const clearIcon = wrapper.find('.clear-icon')
    expect(clearIcon.exists()).toBe(true)

    await clearIcon.trigger('click')
    expect(store.searchQuery).toBe('')
  })

  it('calls searchTvShow with debounce when query changes', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    })

    const wrapper = mount(SearchTvShow, {
      global: {
        plugins: [pinia],
      },
    })

    const store = useTvShowStore()
    const spy = vi.spyOn(store, 'searchTvShow')

    const input = wrapper.get('input')
    await input.setValue('mg')

    vi.advanceTimersByTime(500)

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
