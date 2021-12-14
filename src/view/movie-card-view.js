import {getFormattedDate} from '../utils/movie-utils';
import {CARD_BUTTON_ACTIVE_CLASS_NAME} from '../constants';
import AbstractView from './abstract-view';

const createMovieCardTemplate = (movie) => {
  const {
    title,
    rating,
    poster,
    description,
    genres,
    releaseDate,
    duration,
    comments,
    isFavorite,
    isWatched,
    isInWatchlist,
  } = movie;
  const releaseYear = getFormattedDate(releaseDate, 'YYYY');

  const favoriteClassName = isFavorite ? CARD_BUTTON_ACTIVE_CLASS_NAME : '';
  const alreadyWatchedClassName = isWatched ? CARD_BUTTON_ACTIVE_CLASS_NAME : '';
  const inWatchListClassName = isInWatchlist ? CARD_BUTTON_ACTIVE_CLASS_NAME : '';

  let trimmedDescription;

  if (description.length > 140) {
    trimmedDescription = description.substr(0, 139);
    trimmedDescription = `${trimmedDescription}...`;
  }

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${trimmedDescription ? trimmedDescription : description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${inWatchListClassName}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatchedClassName}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class MovieCardView extends AbstractView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#editClickHandler);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }
}
