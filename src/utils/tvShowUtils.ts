import type { TvShow } from '@/types/tvShowTypes'

export const groupByGenre = (tvShows: TvShow[]) => {
  const genreMap: Record<string, TvShow[]> = {}
  const uncategorized: TvShow[] = []

  tvShows.forEach((show) => {
    if (!show.genres || show.genres.length === 0) {
      uncategorized.push(show)
      return
    }

    show.genres.forEach((genre) => {
      if (!genreMap[genre]) genreMap[genre] = []
      genreMap[genre].push(show)
    })
  })

  if (uncategorized.length > 0) genreMap['Uncategorized'] = uncategorized

  return genreMap
}

export const sortByRating = (genreMap: Record<string, TvShow[]>) => {
  const sortByRatingFunc = (a: TvShow, b: TvShow) =>
    (b.rating.average ?? 0) - (a.rating.average ?? 0)

  Object.keys(genreMap).forEach((genre) => genreMap[genre]?.sort(sortByRatingFunc))

  return genreMap
}
