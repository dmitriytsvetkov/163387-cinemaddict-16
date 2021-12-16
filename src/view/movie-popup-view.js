import {getFormattedDate} from '../utils/movie-utils';
import {POPUP_BUTTON_ACTIVE_CLASS_NAME} from '../constants';
import AbstractView from './abstract-view';

const isGenresMultiple = (array) => array.length > 1;

const createMoviePopupGenreTemplate = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

const createMoviePopupTemplate = (movie) => {
  const {
    title,
    alternativeTitle,
    poster,
    rating,
    director,
    writers,
    actors,
    releaseDate,
    duration,
    releaseCountry,
    genres,
    description,
    ageRating,
    isFavorite,
    isInWatchlist,
    isWatched,
  } = movie;
  const formattedReleaseDate = getFormattedDate(releaseDate, 'D MMMM YYYY');
  const genresTemplate = createMoviePopupGenreTemplate(genres);

  const favoriteClassName = isFavorite ? POPUP_BUTTON_ACTIVE_CLASS_NAME : '';
  const alreadyWatchedClassName = isWatched ? POPUP_BUTTON_ACTIVE_CLASS_NAME : '';
  const inWatchListClassName = isInWatchlist ? POPUP_BUTTON_ACTIVE_CLASS_NAME : '';

  return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formattedReleaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${isGenresMultiple(genres) ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell">
                    ${genresTemplate}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${inWatchListClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched ${alreadyWatchedClassName}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
        </div>
      </form>
    </section>`;
};

export default class MoviePopupView extends AbstractView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMoviePopupTemplate(this.#movie);
  }

  setClosePopupClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupClickHandler);
  }

  #closePopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }

  setAddToWatchClickHandler = (callback) => {
    this._callback.addToWatchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addToWatchlistClickHandler);
  }

  setMarkAsWatchedClickHandler = (callback) => {
    this._callback.markAsWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#markAsWatchedClickHandler);
  }

  setAddToFavoriteClickHandler = (callback) => {
    this._callback.addToFavoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#addToFavoriteClickHandler);
  }

  #addToWatchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToWatchlistClick();
  }

  #markAsWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.markAsWatchedClick();
  }

  #addToFavoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToFavoriteClick();
  }
}
