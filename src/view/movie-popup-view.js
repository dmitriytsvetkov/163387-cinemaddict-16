import {getFormattedMovieDate, getFormattedMovieDuration, getRelativeTime} from '../utils/movie-utils';
import {POPUP_BUTTON_ACTIVE_CLASS_NAME} from '../constants';
import SmartView from './smart-view';

const isGenresMultiple = (array) => array.length > 1;

const createMoviePopupGenreTemplate = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

const createRepeatingCommentTemplate = (comments) => comments.map(({author, date, emoji, text}) => `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
  </span>
  <div>
    <p class="film-details__comment-text">${text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${getRelativeTime(date)}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`).join('');

const createNewCommentTemplate = (newEmoji) => `<div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">${newEmoji ? `<img src="./images/emoji/${newEmoji}.png" width="55" height="55" alt="emoji">` : ''}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${newEmoji === 'smile' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${newEmoji === 'sleeping' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${newEmoji === 'puke' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${newEmoji === 'angry' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>`;

const createMovieCommentsTemplate = (movieComments, newEmoji) => {
  const repeatingCommentTemplate = createRepeatingCommentTemplate(movieComments);
  const newCommentTemplate = createNewCommentTemplate(newEmoji);

  return `<section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${movieComments.length}</span></h3>

            <ul class="film-details__comments-list">
                ${repeatingCommentTemplate}
            </ul>
                ${newCommentTemplate}
          </section>`;
};

const createMoviePopupTemplate = (movie, comments) => {
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
    newEmoji
  } = movie;

  const formattedReleaseDate = getFormattedMovieDate(releaseDate, 'D MMMM YYYY');
  const formattedDuration = getFormattedMovieDuration(duration);
  const genresTemplate = createMoviePopupGenreTemplate(genres);
  const commentsTemplate = createMovieCommentsTemplate(comments, newEmoji);

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
                  <td class="film-details__cell">${formattedDuration}</td>
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
            ${commentsTemplate}
        </div>
      </form>
    </section>`;
};

export default class MoviePopupView extends SmartView {
  #comments = null;

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
