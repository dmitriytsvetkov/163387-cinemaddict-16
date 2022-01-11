import SmartView from './smart-view';
import {createMoviePopupTemplate} from './templates/movie-popup-template';

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

  get movieData() {
    return this._data;
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
    deleteButtons.forEach((button, index) => {
      button.addEventListener('click', (evt) => {
        evt.preventDefault();
        console.log(this.#comments)
        console.log(index)
        this._callback.deleteCommentsClick(this._data, index);
      });
    });
  }

  setFormSubmitClickHandler = (callback) => {
    this._callback.submitForm = callback;
    const form = this.element.querySelector('.film-details__inner');
    form.addEventListener('keydown', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    if ((evt.keyCode === 10 || evt.keyCode === 13) && evt.ctrlKey) {
      this._callback.submitForm(MoviePopupView.parseDataToMovie(this._data, this.#comments));
    }
  }

  #setInnerHandlers = () => {
    const inputs = this.element.querySelectorAll('.film-details__emoji-item');
    inputs.forEach((input) => {
      input.addEventListener('change', this.#emojiChangeHandler);
    });
    const newCommentInput = this.element.querySelector('.film-details__comment-input');
    newCommentInput.addEventListener('change', (this.#newCommentChangeHandler));
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
      newEmoji: evt.target.value
    });
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setClosePopupClickHandler(this._callback.closeClick);
    this.setAddToWatchClickHandler(this._callback.addToWatchlistClick);
    this.setAddToFavoriteClickHandler(this._callback.addToFavoriteClick);
    this.setMarkAsWatchedClickHandler(this._callback.markAsWatchedClick);
    this.setFormSubmitClickHandler(this._callback.submitForm);
  }

  static parseMovieToData = (movie) => (
    {...movie, newEmoji: null, newComment: null}
  )

  static parseDataToMovie = (data, comments) => {
    const movie = {...data};
    const commentsCopy = {...comments};
    // есть фильм и есть комменты
    console.log(movie.newEmoji)
    console.log(movie.newComment)
    console.log(movie.comments)
    console.log(movie.comments.push(22))
    const newComment = {
      id: 123,
      text: movie.newComment,
      date: '123',
      author: 'Dmitriy',
      emoji: movie.newEmoji,
    };

    movie.comments = [];

    delete movie.newEmoji;
    delete movie.newComment;
    return movie;
  }
}
