const MoviesToFilterMap = {
  watchlist: (movies) => movies.filter((movie) => !movie.isInWatchlist).length,
  history: (movies) => movies.filter((movie) => !movie.isWatched).length,
  favorites: (movies) => movies.filter((movie) => !movie.isFavorite).length,
};

const generateMoviesFilter = (movies) => Object.entries(MoviesToFilterMap).map(([filterName, countFunc]) => ({
  name: filterName,
  count: countFunc(movies)
}),
);

export {generateMoviesFilter};
