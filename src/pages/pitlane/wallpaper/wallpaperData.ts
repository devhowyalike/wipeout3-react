import { Wallpaper, Resolution } from "./Wallpaper.types"

/** Available wallpaper resolution labels. */
export const resolution: Resolution = {
  res1: "0800 x 0600",
  res2: "1024 x 0768",
};

/**
 * Wallpaper catalogue — each entry lists the team/subject name and download
 * paths per resolution.
 */
export const wallpapers: Wallpaper[] = [
  {
    name: "W3: Let's Be Friends",
    sizes: {
      [resolution.res1]: "/wallpapers/wo3800.gif",
      [resolution.res2]: "/wallpapers/wo31024.gif",
    },
  },
  {
    name: "World 3 Map",
    sizes: {
      [resolution.res1]: "/wallpapers/world800.gif",
      [resolution.res2]: "/wallpapers/world1024.gif",
    },
  },
  {
    name: "AG-Systems Int.",
    sizes: {
      [resolution.res1]: "/wallpapers/ags800.gif",
      [resolution.res2]: "/wallpapers/ags1024.gif",
    },
  },
  {
    name: "Assegai Dev.",
    sizes: {
      [resolution.res1]: "/wallpapers/ass800.gif",
      [resolution.res2]: "/wallpapers/ass1024.gif",
    },
  },
  {
    name: "Auricom Ind.",
    sizes: {
      [resolution.res1]: "/wallpapers/aur800.gif",
      [resolution.res2]: "/wallpapers/aur1024.gif",
    },
  },
  {
    name: "Feisar",
    sizes: {
      [resolution.res1]: "/wallpapers/feis800.gif",
      [resolution.res2]: "/wallpapers/feis1024.gif",
    },
  },
  {
    name: "Goteki 45",
    sizes: {
      [resolution.res1]: "/wallpapers/got800.gif",
      [resolution.res2]: "/wallpapers/got1024.gif",
    },
  },
  {
    name: "Icaras",
    sizes: {
      [resolution.res1]: "/wallpapers/ica800.gif",
      [resolution.res2]: "/wallpapers/ica1024.gif",
    },
  },
  {
    name: "Pirhana Adv.",
    sizes: {
      [resolution.res1]: "/wallpapers/pir800.gif",
      [resolution.res2]: "/wallpapers/pir1024.gif",
    },
  },
  {
    name: "Qirex RD",
    sizes: {
      [resolution.res1]: "/wallpapers/qir800.gif",
      [resolution.res2]: "/wallpapers/qir1024.gif",
    },
  },
];