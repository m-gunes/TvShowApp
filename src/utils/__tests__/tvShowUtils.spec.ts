import { describe, it, expect } from 'vitest'
import { groupByGenre, sortByRating } from '@/utils/tvShowUtils'
import type { TvShow } from '@/types/tvShowTypes'

describe('tvShowUtils', () => {
  const makeShow = (id: number, genres: string[], rating?: number): TvShow =>
    ({
      id,
      name: `Show ${id}`,
      genres,
      rating: { average: rating ?? null },
    }) as TvShow

  it('groups shows by genre and adds Uncategorized', () => {
    const shows = [makeShow(1, ['Drama', 'Crime']), makeShow(2, []), makeShow(3, ['Drama'])]

    const grouped = groupByGenre(shows)

    expect(grouped.Drama).toHaveLength(2)
    expect(grouped.Crime).toHaveLength(1)
    expect(grouped.Uncategorized).toHaveLength(1)
  })

  it('sorts shows in each genre by rating desc', () => {
    const grouped = {
      Drama: [makeShow(1, ['Drama'], 5), makeShow(2, ['Drama'], 8), makeShow(3, ['Drama'], 3)],
    }

    sortByRating(grouped)

    expect(grouped.Drama.map((s) => s.id)).toEqual([2, 1, 3])
  })
})
