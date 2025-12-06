export interface TvShow {
  id: number
  name: string
  genres: string[]
  rating: { average: number | null }
  image?: { medium?: string; original?: string }
  summary?: string
}

export type TvShowSearchItem = {
  score: number
  show: TvShow
}
