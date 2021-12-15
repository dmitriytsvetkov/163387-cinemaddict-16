import MovieCardView from '../view/movie-card-view';
import MoviePopupView from '../view/movie-popup-view';
import {remove, render, RenderPosition, replace} from '../utils/render';
import MovieCommentsView from '../view/movie-comments-view';

export default class MoviePresenter {
  #movieListContainer = null;
  #changeData = null;

  #movieComponent = null;
  #moviePopupComponent = null;
  #movieCommentsComponent = null;

  #siteBodyElement = document.querySelector('body');

  #movie = null;
  #comments = null;

  constructor(movieListContainer, changeData) {
    this.#movieListContainer = movieListContainer;
    this.#changeData = changeData;
  }

  init = (movie, comments) => {
    this.#movie = movie;
    this.#comments = comments;

    const prevMovieComponent = this.#movieComponent;
    //const prevMoviePopupComponent = this.#moviePopupComponent;
    //const prevMovieComments = this.#movieCommentsComponent;

    this.#movieComponent = new MovieCardView(movie);
    this.#moviePopupComponent = new MoviePopupView(movie);
    this.#movieCommentsComponent = new MovieCommentsView(movie, comments);

    this.#movieComponent.setEditClickHandler(this.#editClickHandler);
    this.#moviePopupComponent.setClosePopupClickHandler(this.#closePopupClickHandler);
    this.#movieComponent.setAddToWatchClickHandler(this.#addToWatchClickHandler);

    if (prevMovieComponent === null) {
      render(this.#movieListContainer, this.#movieComponent, RenderPosition.BEFORE_END);
      return;
    }

    if (this.#movieListContainer.element.contains(prevMovieComponent.element)) {
      replace(this.#movieComponent, prevMovieComponent);
    }

    remove(prevMovieComponent);
    //remove(prevMoviePopupComponent);
  }

  destroy = () => {
    remove(this.#movieComponent);
    remove(this.#moviePopupComponent);
  }

  #showPopup = () => {
    render(this.#siteBodyElement, this.#moviePopupComponent, RenderPosition.AFTER_END);
    const filmDetailsBottomContainerElement = this.#moviePopupComponent.element.querySelector('.film-details__bottom-container');
    render(filmDetailsBottomContainerElement, this.#movieCommentsComponent, RenderPosition.BEFORE_END);
  };

  #hidePopup = () => {
    this.#siteBodyElement.nextSibling.remove();
    this.#siteBodyElement.classList.remove('hide-overflow');
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
}

