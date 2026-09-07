const beerLogKeys = {
  all: ["beerLogs"] as const,
  lists: () => [...beerLogKeys.all, "list"] as const,
  detail: (id: number) => [...beerLogKeys.all, "detail", id] as const,
};

const BEER_LOG_API_ROUTE = "/beerlog";

export { beerLogKeys, BEER_LOG_API_ROUTE };
