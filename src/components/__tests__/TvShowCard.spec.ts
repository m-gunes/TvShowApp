import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import TvShowCard from '@/components/TvShowCard.vue'
import { createTvShow } from '@/testUtil/createTvShow.ts'


describe('TvShowCard', () => {
  it('renders show name, rating and genres', () => {
    const tvShow = createTvShow({
      name: 'Seinfeld',
      genres: ['Comedy'],
      rating: { average: 8.3 },
    })

    const wrapper = mount(TvShowCard, {
      props: { tvShow },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Seinfeld')
    expect(wrapper.text()).toContain('Rating: 8.3')
    expect(wrapper.text()).toContain('Comedy')
  })

  it('shows "No image" placeholder when image is missing', () => {
    const tvShow = createTvShow({
      image: { medium: '', original: '' },
    })

    const wrapper = mount(TvShowCard, {
      props: { tvShow },
      global: {
        stubs: { RouterLink: RouterLinkStub },
      },
    })
    expect(wrapper.text()).toContain('No image')
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('links to detail route with tv show id', () => {
    const tvShow = createTvShow({ id: 530 })

    const wrapper = mount(TvShowCard, {
      props: { tvShow },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const link = wrapper.getComponent(RouterLinkStub)
    expect(link.props().to).toEqual({ name: 'detail', params: { id: 530 } })
  })
})
