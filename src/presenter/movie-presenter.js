import MovieCardView from '../view/movie-card-view';
import MoviePopupView from '../view/movie-popup-view';
import {remove, render, RenderPosition, replace} from '../utils/render';
import MovieCommentsView from '../view/movie-comments-view';

const Mode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED'
};

export default class MoviePresenter {
  #movieListContainer = null;
  #changeData = null;
  #changeMode = null;

  #movieComponent = null;
  #moviePopupComponent = null;
  #movieCommentsComponent = null;

  #siteBodyElement = document.querySelector('body');

  #movie = null;
  #comments = null;
  #mode = Mode.CLOSED;

  constructor(movieListContainer, changeData, changeMode) {
    this.#movieListContainer = movieListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (movie, comments) => {
    this.#movie = movie;
    this.#comments = comments;

    const prevMovieComponent = this.#movieComponent;
    const prevMoviePopupComponent = this.#moviePopupComponent;

    this.#movieComponent = new MovieCardView(movie);
    this.#moviePopupComponent = new MoviePopupView(movie);
    this.#movieCommentsComponent = new MovieCommentsView(movie, comments);

    this.#movieComponent.setEditClickHandler(this.#editClickHandler);
    this.#movieComponent.setAddToWatchClickHandler(this.#addToWatchClickHandler);
    this.#movieComponent.setMarkAsWatchedClickHandler(this.#markAsWatchedClickHandler);
    this.#movieComponent.setAddToFavoriteClickHandler(this.#addToFavoriteClickHandler);
    this.#moviePopupComponent.setClosePopupClickHandler(this.#closePopupClickHandler);
    this.#moviePopupComponent.setAddToWatchClickHandler(this.#addToWatchClickHandler);
    this.#moviePopupComponent.setMarkAsWatchedClickHandler(this.#markAsWatchedClickHandler);
    this.#moviePopupComponent.setAddToFavoriteClickHandler(this.#addToFavoriteClickHandler);

    if (prevMovieComponent === null) {
      render(this.#movieListContainer, this.#movieComponent, RenderPosition.BEFORE_END);
      return;
    }

    if (this.#movieListContainer.element.contains(prevMovieComponent.element)) {
      replace(this.#movieComponent, prevMovieComponent);
      replace(this.#moviePopupComponent, prevMoviePopupComponent);
    }

    remove(prevMovieComponent);
    remove(prevMoviePopupComponent);
  }

  destroy = () => {
    remove(this.#movieComponent);
    remove(this.#moviePopupComponent);
  }

  resetView = () => {
    if (this.#mode === Mode.OPENED) {
      this.#hidePopup();
    }
  }

  #showPopup = () => {
    render(this.#siteBodyElement, this.#moviePopupComponent, RenderPosition.AFTER_END);
    const filmDetailsBottomContainerElement = this.#moviePopupComponent.element.querySelector('.film-details__bottom-container');
    render(filmDetailsBottomContainerElement, this.#movieCommentsComponent, RenderPosition.BEFORE_END);
    this.#changeMode();
    this.#mode = Mode.OPENED;
  };

  #hidePopup = () => {
    remove(this.#moviePopupComponent);
    this.#siteBodyElement.classList.remove('hide-overflow');
    this.#mode = Mode.CLOSED;
  };

  #onEscKeyKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hidePopup();
      document.removeEventListener('keydown', this.#onEscKeyKeyDown);
    }
  };

  #editClickHandler = () => {
    this.#siteBodyElement.classList.add('hide-overflow');
    this.#showPopup();
    document.addEventListener('keydown', this.#onEscKeyKeyDown);
  }

  #closePopupClickHandler = () => {
    this.#hidePopup();
    document.removeEventListener('keydown', this.#onEscKeyKeyDown);
  }

  #addToWatchClickHandler = () => {
    this.#changeData({...this.#movie, isInWatchlist: !this.#movie.isInWatchlist});
  }

  #markAsWatchedClickHandler = () => {
    this.#changeData({...this.#movie, isWatched: !this.#movie.isWatched});
  }

  #addToFavoriteClickHandler = () => {
    this.#changeData({...this.#movie, isFavorite: !this.#movie.isFavorite});
  }
}

