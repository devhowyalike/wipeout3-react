import { MovieItem } from "@/types/Movies.types";
import { modalWidth, modalHeight } from "./moviesConfig";

/** Static list of playable movie clips with their source paths and popup dimensions. */
export const movieData: MovieItem[] = [
  {
    id: "portokora",
    name: "Porto Kora",
    src: "/movies/porto-kora.mp4",
    width: modalWidth,
    height: modalHeight,
  },
  {
    id: "samparun",
    name: "Sampa Run",
    src: "/movies/sampa-run.mp4",
    width: modalWidth,
    height: modalHeight,
  },
  {
    id: "stanzainter",
    name: "Stanza Inter",
    src: "/movies/stanza-inter.mp4",
    width: modalWidth,
    height: modalHeight,
  },
  {
    id: "megamall",
    name: "Mega Mall",
    src: "/movies/mega-mall.mp4",
    width: modalWidth,
    height: modalHeight,
  },
];