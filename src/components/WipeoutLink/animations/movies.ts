const movieAnimations = {
  portokora: "welcome",
  samparun: "movies",
  stanzainter: "screenshots",
  megamall: "typography",
} as const;

/**
 * Maps a movie ID to its corresponding hover animation name.
 *
 * @param id - Movie identifier (e.g. `"portokora"`, `"megamall"`).
 */
export const getMovieAnimation = (id: string) =>
  movieAnimations[id as keyof typeof movieAnimations];
