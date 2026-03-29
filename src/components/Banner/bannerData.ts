/** Identifier and display name for a team banner animation. */
export interface BannerItem {
  id: string;
  name: string;
}

/** Static list of Wipeout 3 team banner entries. */
export const bannerData: BannerItem[] = [
  { id: 'agsystems', name: 'AG Systems' },
  { id: 'assegai', name: 'Assegai' },
  { id: 'auricom', name: 'Auricom' },
  { id: 'f7200', name: 'F7200' },
  { id: 'feisar', name: 'Feisar' },
  { id: 'goteki45', name: 'Goteki 45' },
  { id: 'icaras', name: 'Icaras' },
  { id: 'pirhana', name: 'Pirhana' },
  { id: 'qirex', name: 'Qirex' },
];

/**
 * Finds a banner entry by its ID.
 *
 * @param id - Banner identifier (e.g. `"agsystems"`, `"feisar"`).
 */
export function getBannerById(id: string): BannerItem | undefined {
  return bannerData.find(banner => banner.id === id);
}