import {FilterType} from '../../constants';

const NoMoviesTextType = {
  [FilterType.ALL] : 'There are no movies in our database',
  [FilterType.WATCHLIST] : 'There are no movies to watch now',
  [FilterType.HISTORY] : 'There are no watched movies now',
  [FilterType.FAVORITES] : 'There are no favorite movies now',
};

const createNoMoviesViewTemplate = (textType) => {
  const text = NoMoviesTextType[textType];

  return `<h2 class="films-list__title">${text}</h2>`;
};

export {createNoMoviesViewTemplate};
