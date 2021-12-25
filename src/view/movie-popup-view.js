import SmartView from './smart-view';
import {createMoviePopupTemplate} from './templates/movie-popup-template';

export default class MoviePopupView extends SmartView {
  #comments = null;
  #movie = null;

  constructor(movie, comments) {
    super();
    this._data = MoviePopupView.parseMovieToData(movie);
    this.#comments = comments;

    this.#setInnerHandlers();
  }

  get template() {
    return createMoviePopupTemplate(this._data, this.#comments);
  }

  setClosePopupClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupClickHandler);
  }

  #closePopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setAddToWatchClickHandler = (callback, movie) => {
    this._callback.addToWatchlistClick = callback;
    this.#movie = movie;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addToWatchlistClickHandler);
  }

  setMarkAsWatchedClickHandler = (callback, movie) => {
    this._callback.markAsWatchedClick = callback;
    this.#movie = movie;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#markAsWatchedClickHandler);
  }

  setAddToFavoriteClickHandler = (callback, movie) => {
    this._callback.addToFavoriteClick = callback;
    this.#movie = movie;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#addToFavoriteClickHandler);
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

  #setInnerHandlers = () => {
    const inputs = this.element.querySelectorAll('.film-details__emoji-item');
    inputs.forEach((input) => {
      input.addEventListener('change', this.#emojiChangeHandler);
    });
  }

  #emojiChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      newEmoji: evt.target.value
    });

  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setClosePopupClickHandler(this._callback.closeClick);
    this.setAddToWatchClickHandler(this._callback.addToWatchlistClick);
    this.setAddToFavoriteClickHandler(this._callback.addToFavoriteClick);
    this.setMarkAsWatchedClickHandler(this._callback.markAsWatchedClick);
  }

  static parseMovieToData = (movie) => ({...movie, newEmoji: null})

  static parseDataToMovie = (data) => {
    const movie = {...data};

    delete movie.newEmoji;
    return movie;
  }
}
