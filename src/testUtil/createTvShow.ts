import type { TvShow } from '@/types/tvShowTypes'

export const createTvShow = (partial: Partial<TvShow> = {}): TvShow => ({
  id: partial.id ?? 1,
  name: partial.name ?? 'Test Show',
  genres: partial.genres ?? [],
  rating: partial.rating ?? { average: null },
  image: partial.image ?? { medium: '', original: '' },
  summary: partial.summary ?? '',
  status: partial.status ?? 'Running',
  type: partial.type ?? 'Scripted',
  network: partial.network ?? null,
  officialSite: partial.officialSite ?? null,
  language: partial.language ?? 'English',
  premiered: partial.premiered ?? null,
  ended: partial.ended ?? null,
})
