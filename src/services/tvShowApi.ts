import type { TvShow, TvShowSearchItem } from '@/types/tvShowTypes.ts'

const BASE_URL = 'https://api.tvmaze.com'

export async function fetchShows(): Promise<TvShow[]> {
  const res = await fetch(`${BASE_URL}/shows`)
  if (!res.ok) throw new Error('Failed to fetch shows')
  return res.json()
}

export async function fetchShowById(id: number): Promise<TvShow> {
  const res = await fetch(`${BASE_URL}/shows/${id}`)
  if (!res.ok) throw new Error('Failed to fetch shows')
  return res.json()
}

export async function searchShow(query: string): Promise<TvShow[]> {
  const res = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('Failed to search shows')
  const data = await res.json()
  return data.map((item: TvShowSearchItem) => item.show)
}
