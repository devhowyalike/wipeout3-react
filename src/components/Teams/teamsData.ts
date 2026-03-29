import { routeDefinitions } from "@/routes/routeDefinitions";

/** Shape of a single team entry with navigation paths for the team page and screensaver. */
export interface TeamsData {
  id: string;
  teamName: string;
  route: string;
  screenSaver: string;
}

const routeById = Object.fromEntries(
  routeDefinitions
    .filter((r): r is Extract<typeof r, { path: string }> => "path" in r)
    .map((r) => [r.id, r]),
);

const teamIds = [
  "agsystems",
  "assegai",
  "auricom",
  "feisar",
  "goteki45",
  "icaras",
  "pirhanaAdv",
  "qirex",
] as const;

/**
 * Derived team roster — each entry includes the team name, page route, and
 * screensaver route, resolved from routeDefinitions.
 */
export const teamsData: TeamsData[] = teamIds.map((id) => {
  const route = routeById[id];
  return {
    id,
    teamName: route.label,
    route: route.path,
    screenSaver: `${route.path}/screensaver`,
  };
});
