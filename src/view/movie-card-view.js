import AbstractView from './abstract-view';
import {createMovieCardTemplate} from './templates/movie-card-template';

export default class MovieCardView extends AbstractView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
  }

  setOpenPopupClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#openPopupClickHandler);
  }

  #openPopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }

  setAddToWatchClickHandler = (callback) => {
    this._callback.addToWatchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addToWatchlistClickHandler);
  }

  setMarkAsWatchedClickHandler = (callback) => {
    this._callback.markAsWatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#markAsWatchedClickHandler);
  }

  setAddToFavoriteClickHandler = (callback) => {
    this._callback.addToFavoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#addToFavoriteClickHandler);
  }

  #addToWatchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToWatchlistClick(this.#movie);
  }

  #markAsWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.markAsWatchedClick(this.#movie);
  }

  #addToFavoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToFavoriteClick(this.#movie);
  }
}
