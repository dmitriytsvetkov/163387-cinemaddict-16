const POPUP_BUTTON_ACTIVE_CLASS_NAME = 'film-details__control-button--active';
const CARD_BUTTON_ACTIVE_CLASS_NAME = 'film-card__controls-item--active';

const SortType = {
  DEFAULT: 'by_default',
  BY_DATE: 'by_date',
  BY_RATING: 'by_rating',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  COMMENTS_INIT: 'COMMENTS_INIT',
};

const UserAction = {
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  DELETE_COMMENT: 'DELETE_COMMENT',
  ADD_COMMENT: 'ADD_COMMENT',
};

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
  STATISTIC: 'Stats',
};

const MenuItem = {
  MOVIES: 'MOVIES',
  STATS: 'STATS',
};

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

const FILTER_TYPES = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const KEYCODES = {
  ENTER: 10,
  ENTER_ALT: 13,
  ESCAPE: 'Escape',
  ESCAPE_ALT: 'Esc',
};

const DAYS_SHORTCUTS = {
  ONE_DAY: 1,
  WEEK: 7,
  MONTH: 31,
  YEAR: 366,
};

const NoMoviesTextType = {
  [FilterType.ALL] : 'There are no movies in our database',
  [FilterType.WATCHLIST] : 'There are no movies to watch now',
  [FilterType.HISTORY] : 'There are no watched movies now',
  [FilterType.FAVORITES] : 'There are no favorite movies now',
};

const MAX_SHORT_DESCRIPTION_LENGTH = 140;

const ApiMethod = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST',
};

export {ApiMethod, NoMoviesTextType, State, POPUP_BUTTON_ACTIVE_CLASS_NAME, CARD_BUTTON_ACTIVE_CLASS_NAME, SortType, MAX_SHORT_DESCRIPTION_LENGTH, UpdateType, UserAction, FilterType, KEYCODES, MenuItem, FILTER_TYPES, DAYS_SHORTCUTS};
