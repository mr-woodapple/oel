// Holding the accountKeys to make cache invalidation easier, mainly avoid making typos.
const beerKeys = {
  all: ['beers'] as const,
  lists: () => [...beerKeys.all, 'list'] as const,
};

// The api route for accounts
const BEER_API_ROUTE = "/beer";

export { beerKeys, BEER_API_ROUTE }
