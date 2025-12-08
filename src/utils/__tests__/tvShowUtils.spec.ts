import { describe, it, expect } from 'vitest'
import { groupByGenre, sortByRating } from '@/utils/tvShowUtils'
import type { TvShow } from '@/types/tvShowTypes'


const createTvShowMockData = (partial: Partial<TvShow>): TvShow => ({
  id: partial.id ?? 0,
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
});

const DRAMA = 'Drama';
const CRIME = 'Crime';
const UNCATEGORIZED = 'Uncategorized';

describe('groupByGenre', () => {
  it('should return an empty object when list is empty', () => {
    const result = groupByGenre([]);
    expect(result).toEqual({});
  });
  it('should return group by genre, including multi genre and Uncategorized', () => {
    const tvShows = [
      createTvShowMockData({id: 1, name: "Tv show 1", genres: [DRAMA]}),
      createTvShowMockData({id: 2, name: "Tv show 2", genres: [DRAMA, CRIME]}),
      createTvShowMockData({id: 3, name: "Tv show 3", genres: []}),
    ];

    const result = groupByGenre(tvShows)

    // check the keys if exist
    expect(Object.keys(result).sort()).toEqual([CRIME, DRAMA, UNCATEGORIZED]);
    expect(Object.keys(result)).toContain(DRAMA);
    expect(Object.keys(result)).toContain(CRIME);
    expect(Object.keys(result)).toContain(UNCATEGORIZED);

    // Drama genre should have 2 tv shows
    expect(result[DRAMA]).toHaveLength(2);
    expect(result[CRIME]).toHaveLength(1);
    expect(result[UNCATEGORIZED]).toHaveLength(1);

    expect(result[DRAMA]!.map(s => s.id)).toEqual([1,2]);
    expect(result[CRIME]!.map(s => s.id)).toEqual([2]);
    expect(result[UNCATEGORIZED]!.map(s => s.id)).toEqual([3]);

  })

})

// describe('tvShowUtils', () => {
//   const makeShow = (id: number, genres: string[], rating?: number): TvShow =>
//     ({
//       id,
//       name: `Show ${id}`,
//       genres,
//       rating: { average: rating ?? null },
//     }) as TvShow
//
//   it('groups shows by genre and adds Uncategorized', () => {
//     const shows = [makeShow(1, ['Drama', 'Crime']), makeShow(2, []), makeShow(3, ['Drama'])]
//
//     const grouped = groupByGenre(shows)
//
//     expect(grouped.Drama).toHaveLength(2)
//     expect(grouped.Crime).toHaveLength(1)
//     expect(grouped.Uncategorized).toHaveLength(1)
//   })
//
//   it('sorts shows in each genre by rating desc', () => {
//     const grouped = {
//       Drama: [makeShow(1, ['Drama'], 5), makeShow(2, ['Drama'], 8), makeShow(3, ['Drama'], 3)],
//     }
//
//     sortByRating(grouped)
//
//     expect(grouped.Drama.map((s) => s.id)).toEqual([2, 1, 3])
//   })
// })
