export const baseRoute = import.meta.env.BASE_URL;

// Hackathon routes for router
export const hackathonRouterRoute = `${baseRoute}:id`;
export const hackathonGameRouterRoute = `${baseRoute}:id/game/:gameId`;

// Hackathon routes
export const hackathonRoute = (hackathonId: string) =>
  `${baseRoute}${hackathonId}`;
export const hackathonGameRoute = (hackathonId: string, gameId: string) =>
  `${hackathonRoute(hackathonId)}/game/${gameId}`;

// Hackathon routes for testing
export const baseRouteForTesting = '/';
export const hackathonRouteForTesting = `${baseRouteForTesting}:id`;
export const gameRouteForTesting = `${baseRouteForTesting}:id/game/:gameId`;
