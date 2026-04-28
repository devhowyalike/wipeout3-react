import type { ComponentType } from "react";
import { PSY_CONTACT_EMAIL } from "@/config/constants";
import { loadOptions } from "@/config/options";

// ── Route definition types ──────────────────────────────────────────────
// A discriminated union covering the three kinds of route in the app.
// Every route is defined once here — id, label, path, and import factory.
// All other route-related data (RouteId type, routesConfig, prefetchMap)
// is derived from this single array.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ImportFactory = () => Promise<{ default: ComponentType<any> }>;

type PageDef = {
  id: string;
  label: string;
  path: string;
  load: ImportFactory;
};

type ModalDef = {
  id: string;
  label: string;
  type: "modal";
  load: ImportFactory;
};

type MailtoDef = {
  id: string;
  label: string;
  type: "mailto";
  email: string;
};

/** Discriminated union covering the three kinds of route: page, modal, and mailto. */
type RouteDefinition = PageDef | ModalDef | MailtoDef;

/**
 * Canonical route table — every route is defined once here (id, label, path, and import factory).
 * All other route-related data (`RouteId`, `routesConfig`, `prefetchMap`) is derived from this array.
 */
export const routeDefinitions = [
  // Top-level routes
  { id: "home", label: "Menu Select", path: "/", load: () => import("@/pages/home/HomePage") },
  { id: "news", label: "News", path: "/news", load: () => import("@/pages/news/NewsPage") },
  { id: "soundtrack", label: "Sound:track", path: "/soundtrack", load: () => import("@/pages/soundtrack/SoundtrackPage") },
  { id: "teams", label: "Teams", path: "/teams", load: () => import("@/pages/teams/TeamsPage") },
  { id: "tour", label: "Tour", path: "/tour", load: () => import("@/pages/tour/TourPage") },
  { id: "game", label: "The Game", path: "/game", load: () => import("@/pages/game/GamePage") },

  // Game routes
  { id: "developers", label: "Developers", path: "/game/developers", load: () => import("@/pages/game/developers/DevelopersPage") },
  { id: "gameplay", label: "Game:play", path: "/game/gameplay", load: () => import("@/pages/game/gameplay/GameplayPage") },
  { id: "modes", label: "Modes", path: "/game/modes", load: () => import("@/pages/game/modes/ModesPage") },
  { id: "tracks", label: "Tracks", path: "/game/tracks", load: () => import("@/pages/game/tracks/TracksPage") },
  { id: "weapons", label: "Weapons", path: "/game/weapons", load: () => import("@/pages/game/weapons/WeaponsPage") },

  // Preview routes
  { id: "previews", label: "Previews", path: "/game/previews", load: () => import("@/pages/game/previews/PreviewsPage") },
  { id: "movies", label: "Movie Clips", path: "/game/previews/movies", load: () => import("@/pages/game/previews/movies/MoviesPage") },
  { id: "screenshots", label: "Screenshots", type: "modal" as const, load: () => import("@/pages/game/previews/screenshots/ScreenshotsPage") },
  { id: "typography", label: "Typography", path: "/game/previews/typography", load: () => import("@/pages/game/previews/typography/TypographyPage") },
  { id: "welcome", label: "Welcome", path: "/game/previews/welcome", load: () => import("@/pages/game/previews/welcome/WelcomePage") },

  // History routes
  { id: "history", label: "History", path: "/history", load: () => import("@/pages/history/HistoryPage") },
  { id: "xl", label: "2097/XL", path: "/history/2097", load: () => import("@/pages/history/2097/XLPage") },
  { id: "docs", label: "Docs", path: "/history/docs", load: () => import("@/pages/history/docs/DocsPage") },
  { id: "mitdr", label: "Mitdr", path: "/history/mitdr", load: () => import("@/pages/history/mitdr/MitdrPage") },
  { id: "wipeout", label: "Wipeout [1]", path: "/history/wipeout", load: () => import("@/pages/history/wipeout/WipeoutPage") },

  // Teams routes
  { id: "agsystems", label: "A-G Sys:tm", path: "/teams/agsystems", load: () => import("@/pages/teams/agsystems/AGSystemsPage") },
  { id: "assegai", label: "Assegai Dev.", path: "/teams/assegai", load: () => import("@/pages/teams/assegai/AssegaiPage") },
  { id: "auricom", label: "Auricom", path: "/teams/auricom", load: () => import("@/pages/teams/auricom/AuricomPage") },
  { id: "feisar", label: "Feisar", path: "/teams/feisar", load: () => import("@/pages/teams/feisar/FeisarPage") },
  { id: "goteki45", label: "Goteki-45", path: "/teams/goteki45", load: () => import("@/pages/teams/goteki45/Goteki45Page") },
  { id: "icaras", label: "Icaras", path: "/teams/icaras", load: () => import("@/pages/teams/icaras/IcarasPage") },
  { id: "pirhanaAdv", label: "Pirhana Adv.", path: "/teams/pirhana", load: () => import("@/pages/teams/pirhana/PirhanaAdvPage") },
  { id: "qirex", label: "Qirex [R+D]", path: "/teams/qirex", load: () => import("@/pages/teams/qirex/QirexPage") },

  // Screensaver routes
  { id: "agsystemsScreensaver", label: "A-G Sys:tm", path: "/teams/agsystems/screensaver", load: () => import("@/pages/teams/agsystems/screensaver/AGSystemsScreensaverPage") },
  { id: "assegaiScreensaver", label: "Assegai Dev.", path: "/teams/assegai/screensaver", load: () => import("@/pages/teams/assegai/screensaver/AssegaiScreensaverPage") },
  { id: "auricomScreensaver", label: "Auricom", path: "/teams/auricom/screensaver", load: () => import("@/pages/teams/auricom/screensaver/AuricomScreensaverPage") },
  { id: "feisarScreensaver", label: "Feisar", path: "/teams/feisar/screensaver", load: () => import("@/pages/teams/feisar/screensaver/FeisarScreensaverPage") },
  { id: "goteki45Screensaver", label: "Goteki-45", path: "/teams/goteki45/screensaver", load: () => import("@/pages/teams/goteki45/screensaver/Goteki45ScreensaverPage") },
  { id: "icarasScreensaver", label: "Icaras", path: "/teams/icaras/screensaver", load: () => import("@/pages/teams/icaras/screensaver/IcarasScreensaverPage") },
  { id: "pirhanaAdvScreensaver", label: "Pirhana Adv.", path: "/teams/pirhana/screensaver", load: () => import("@/pages/teams/pirhana/screensaver/PirhanaAdvScreensaverPage") },
  { id: "qirexScreensaver", label: "Qirex [R+D]", path: "/teams/qirex/screensaver", load: () => import("@/pages/teams/qirex/screensaver/QirexScreensaverPage") },

  // Pitlane routes
  { id: "pitlane", label: "Pit lane", path: "/pitlane", load: () => import("@/pages/pitlane/PitlanePage") },
  { id: "chat", label: "Chat:Room", path: "/pitlane/chat", load: () => import("@/pages/pitlane/chat/ChatPage") },
  loadOptions().contactModal
    ? { id: "contact", label: "Contact", type: "modal" as const, load: () => import("@/pages/pitlane/contact/ContactForm") }
    : { id: "contact", label: "Contact", type: "mailto" as const, email: PSY_CONTACT_EMAIL },
  { id: "credits", label: "Credits", path: "/pitlane/credits", load: () => import("@/pages/pitlane/credits/CreditsPage") },
  { id: "forum", label: "Forum", path: "/pitlane/forum", load: () => import("@/pages/pitlane/forum/ForumPage") },
  { id: "screensavers", label: "Screensavers", path: "/pitlane/screensavers", load: () => import("@/pages/pitlane/screensavers/ScreensaversPage") },
  { id: "subscribe", label: "Subscribe", path: "/pitlane/subscribe", load: () => import("@/pages/pitlane/subscribe/SubscribePage") },
  { id: "wallpaper", label: "Wallpaper", path: "/pitlane/wallpaper", load: () => import("@/pages/pitlane/wallpaper/WallpaperPage") },
  { id: "banners", label: "Banners", path: "/pitlane/banners", load: () => import("@/pages/pitlane/banners/BannersPage") },
] as const satisfies readonly RouteDefinition[];
