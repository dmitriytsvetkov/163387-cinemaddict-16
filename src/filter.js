const moviesToFilterMap = {
  watchlist: (movies) => movies.filter((movie) => !movie.isInWatchlist).length,
  history: (movies) => movies.filter((movie) => !movie.isWatched).length,
  favorites: (movies) => movies.filter((movie) => !movie.isFavorite).length,
};

const generateFilter = (movies) => Object.entries(moviesToFilterMap).map(([filterName, countFunc]) => ({
  name: filterName,
  count: countFunc(movies)
}),
);

export {generateFilter};
