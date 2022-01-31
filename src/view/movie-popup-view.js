import SmartView from './smart-view';
import {createMoviePopupTemplate} from './templates/movie-popup-template';
import {KEYCODES} from '../constants';

export default class MoviePopupView extends SmartView {
  #comments = null;
  #userComment = '';

  constructor(movie, comments) {
    super();
    this._data = MoviePopupView.parseMovieToData(movie);
    this.#comments = comments;

    this.#setInnerHandlers();
  }

  get template() {
    return createMoviePopupTemplate(this._data, this.#comments);
  }

  restorePrevScroll = (prevScroll) => {
    this.element.scrollTo(0, prevScroll);
  }

  updateComments(comments) {
    this.#comments = comments;
    this.updateElement(this.#comments);
    this.restoreHandlers();
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
    this._callback.addToWatchlistClick(this._data);
  }

  #markAsWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.markAsWatchedClick(this._data);
  }

  #addToFavoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToFavoriteClick(this._data);
  }

  setDeleteCommentClickHandler = (callback) => {
    this._callback.deleteCommentsClick = callback;
    const deleteButtons = this.element.querySelectorAll('.film-details__comment-delete');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', this.#deleteCommentClickHandler);
    });
  }

  setFormSubmitClickHandler = (callback) => {
    this._callback.submitForm = callback;
    const form = this.element.querySelector('.film-details__inner');
    form.addEventListener('keydown', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    if ((evt.keyCode === KEYCODES.ENTER || evt.keyCode === KEYCODES.ENTER_ALT) && evt.ctrlKey) {
      evt.preventDefault();
      this._callback.submitForm(MoviePopupView.parseDataToMovie(this._data, this.#comments));
    }
  }

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteCommentsClick(this._data, evt.target.id);
  }

  #setInnerHandlers = () => {
    const emojiInputs = this.element.querySelectorAll('.film-details__emoji-item');
    emojiInputs.forEach((input) => {
      input.addEventListener('change', this.#emojiChangeHandler);
    });
    const newCommentInput = this.element.querySelector('.film-details__comment-input');
    newCommentInput.addEventListener('input', (this.#newCommentChangeHandler));
  }

  #newCommentChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      newComment: evt.target.value,
    }, true);
  }

  #emojiChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      newEmoji: evt.target.value,
      newComment: this.#userComment ? this.#userComment : this._data.newComment,
    });
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setClosePopupClickHandler(this._callback.closeClick);
    this.setAddToWatchClickHandler(this._callback.addToWatchlistClick);
    this.setAddToFavoriteClickHandler(this._callback.addToFavoriteClick);
    this.setMarkAsWatchedClickHandler(this._callback.markAsWatchedClick);
    this.setFormSubmitClickHandler(this._callback.submitForm);
    this.setDeleteCommentClickHandler(this._callback.deleteCommentsClick);
  }

  shakeComment(id) {
    if (id) {
      this.shake(this.element.querySelector(`.film-details__comment[data-id="${id}"]`), () => {
        this.updateData({
          isDeleting: false,
          deletingCommentId: null
        });
      });
    } else {
      this.shake(this.element, () => {
        this.updateData({
          isSaving: false
        });
      });
    }
  }

  static parseMovieToData = (movie) => ({
    ...movie, newEmoji: null,
    newComment: '',
    isDeleting: false
  })

  static parseDataToMovie = (data) => {
    const movie = {...data};
    const newComment = {
      comment: movie.newComment,
      emotion: movie.newEmoji,
    };

    delete movie.newEmoji;
    delete movie.newComment;

    return {movie, newComment};
  }
}
