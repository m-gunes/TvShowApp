import { describe, it, expect } from 'vitest'
import { groupByGenre, sortByRating } from '@/utils/tvShowUtils'
import { createTvShow } from '@/testUtil/createTvShow.ts'

const DRAMA = 'Drama'
const CRIME = 'Crime'
const UNCATEGORIZED = 'Uncategorized'

describe('tvShowUtils', () => {
  describe('groupByGenre', () => {
    it('returns an empty object when list is empty', () => {
      const result = groupByGenre([])
      expect(result).toEqual({})
    })

    it('groups shows by genre and collects empty-genre shows under "Uncategorized"', () => {
      const tvShows = [
        createTvShow({ id: 1, name: 'Tv show 1', genres: [DRAMA] }),
        createTvShow({ id: 2, name: 'Tv show 2', genres: [DRAMA, CRIME] }),
        createTvShow({ id: 3, name: 'Tv show 3', genres: [] }),
      ]

      const result = groupByGenre(tvShows)

      // check keys order
      expect(Object.keys(result).sort()).toEqual([CRIME, DRAMA, UNCATEGORIZED].sort())

      // Drama
      expect(result[DRAMA]).toHaveLength(2)
      expect(result[DRAMA]!.map((s) => s.id)).toEqual([1, 2])

      // Crime
      expect(result[CRIME]).toHaveLength(1)
      expect(result[CRIME]!.map((s) => s.id)).toEqual([2])

      // Uncategorized
      expect(result[UNCATEGORIZED]).toHaveLength(1)
      expect(result[UNCATEGORIZED]!.map((s) => s.id)).toEqual([3])
    })

    it('adds "Uncategorized" as the last key when present', () => {
      const tvShows = [
        createTvShow({ id: 1, name: 'Tv show 1', genres: [] }),
        createTvShow({ id: 2, name: 'Tv show 2', genres: [DRAMA] }),
        createTvShow({ id: 3, name: 'Tv show 3', genres: [DRAMA, CRIME] }),
      ]

      const result = groupByGenre(tvShows)
      const keys = Object.keys(result)
      const lastKey = keys[keys.length - 1]

      expect(lastKey).toBe(UNCATEGORIZED)
    })
  })

  describe('sortByRating', () => {
    it('sorts shows within each genre by rating in descending order', () => {
      const groupedByGenre = {
        [DRAMA]: [
          createTvShow({ id: 1, rating: { average: 5.5 } }),
          createTvShow({ id: 2, rating: { average: 9.1 } }),
          createTvShow({ id: 3, rating: { average: 7.3 } }),
        ],
      }

      const result = sortByRating(groupedByGenre)
      expect(result[DRAMA]!.map((s) => s.rating.average)).toEqual([9.1, 7.3, 5.5])
    })
  })
})
