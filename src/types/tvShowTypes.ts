interface TvShowNetwork {
  name: string
  country: {
    name: string
  }
}

export interface TvShow {
  id: number
  name: string
  genres: string[]
  rating: { average: number | null }
  image: { medium: string; original: string }
  summary: string
  status: string
  type: string
  network: TvShowNetwork | null
  officialSite: string | null
  language: string
  premiered: string | null
  ended: string | null
}

export type TvShowSearchItem = {
  score: number
  show: TvShow
}
