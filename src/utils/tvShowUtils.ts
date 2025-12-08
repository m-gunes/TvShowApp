import type { TvShow } from '@/types/tvShowTypes'

export const groupByGenre = (tvShowList: TvShow[]) => {
  const map: Record<string, TvShow[]> = {}
  const uncategorized: TvShow[] = []

  tvShowList.forEach((show) => {
    if (!show.genres || show.genres.length === 0) {
      uncategorized.push(show)
      return
    }

    show.genres.forEach((genre) => {
      if (!map[genre]) map[genre] = []
      map[genre].push(show)
    })
  })

  if (uncategorized.length > 0) map['Uncategorized'] = uncategorized

  return map
}

export const sortByRating = (map: Record<string, TvShow[]>) => {
  const sortByRatingFunc = (a: TvShow, b: TvShow) =>
    (b.rating.average ?? 0) - (a.rating.average ?? 0)

  Object.keys(map).forEach((genre) => map[genre]?.sort(sortByRatingFunc))

  return map
}
