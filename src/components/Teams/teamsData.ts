/** Shape of a single team entry with navigation paths for the team page and screensaver. */
interface TeamsData {
  id: string;
  teamName: string;
  route: string;
  screenSaver: string;
}

/**
 * Static team roster — each entry includes the team name, page route, and
 * screensaver route. Labels and paths mirror the entries in routeDefinitions.ts.
 */
export const teamsData: TeamsData[] = [
  { id: "agsystems",  teamName: "A-G Sys:tm",    route: "/teams/agsystems", screenSaver: "/teams/agsystems/screensaver"  },
  { id: "assegai",    teamName: "Assegai Dev.",   route: "/teams/assegai",   screenSaver: "/teams/assegai/screensaver"    },
  { id: "auricom",    teamName: "Auricom",        route: "/teams/auricom",   screenSaver: "/teams/auricom/screensaver"    },
  { id: "feisar",     teamName: "Feisar",         route: "/teams/feisar",    screenSaver: "/teams/feisar/screensaver"     },
  { id: "goteki45",   teamName: "Goteki-45",      route: "/teams/goteki45",  screenSaver: "/teams/goteki45/screensaver"   },
  { id: "icaras",     teamName: "Icaras",         route: "/teams/icaras",    screenSaver: "/teams/icaras/screensaver"     },
  { id: "pirhanaAdv", teamName: "Pirhana Adv.",   route: "/teams/pirhana",   screenSaver: "/teams/pirhana/screensaver"    },
  { id: "qirex",      teamName: "Qirex [R+D]",    route: "/teams/qirex",     screenSaver: "/teams/qirex/screensaver"      },
];
