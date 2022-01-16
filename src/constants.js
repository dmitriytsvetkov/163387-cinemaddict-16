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
  RE_INIT: 'RE_INIT',
};

const UserAction = {
  UPDATE_MOVIE: 'UPDATE_MOVIE'
};

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
  STATISTIC: 'Stats',
};

const ENTER_KEYCODE = 10;

const ENTER_ALT_KEYCODE = 13;

const MAX_SHORT_DESCRIPTION_LENGTH = 140;

export {POPUP_BUTTON_ACTIVE_CLASS_NAME, CARD_BUTTON_ACTIVE_CLASS_NAME, SortType, MAX_SHORT_DESCRIPTION_LENGTH, UpdateType, UserAction, FilterType, ENTER_KEYCODE, ENTER_ALT_KEYCODE};
