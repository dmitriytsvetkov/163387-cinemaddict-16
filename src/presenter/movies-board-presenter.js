import {SortType} from '../constants';
import {remove, render, RenderPosition, replace} from '../utils/render';
import {updateItem} from '../utils/common';
import {sortByYear, sortByRating} from '../utils/movie-utils';
import MoviesSectionView from '../view/movies-section-view';
import MovieListView from '../view/movie-list-view';
import NoMoviesView from '../view/no-movies-view';
import LoadMoreButtonView from '../view/load-more-button-view';
import SortView from '../view/sort-view';
import MovieListContainerView from '../view/movie-list-container-view';
import MoviesCountView from '../view/movies-count-view';
import MovieCardView from '../view/movie-card-view';
import MoviePopupView from '../view/movie-popup-view';

const MOVIE_COUNT_PER_STEP = 5;

export default class MoviesBoardPresenter {
  #container = null;
  #movies = [];
  #sourcedMovies = [];
  #currentSortType = SortType.DEFAULT;
  #comments = [];
  #moviesComponents = new Map();
  #popupScrollPosition = null;

  #renderedMoviesCount = MOVIE_COUNT_PER_STEP;

  #moviesSectionComponent = new MoviesSectionView();
  #movieListComponent = new MovieListView();
  #movieListContainerComponent = new MovieListContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #noMoviesComponent = new NoMoviesView();
  #sortComponent = new SortView();
  #moviePopupComponent = null;

  #siteBodyElement = document.querySelector('body');
  #siteFooterElement = this.#siteBodyElement.querySelector('.footer');
  #footerStatisticsElement = this.#siteFooterElement.querySelector('.footer__statistics');


  constructor(listContainer) {
    this.#container = listContainer;
  }


  init = (movies, comments) => {
    this.#movies = [...movies];
    this.#sourcedMovies = [...movies];
    this.#comments = [...comments];

    render(this.#container, this.#moviesSectionComponent, RenderPosition.BEFORE_END);
    render(this.#moviesSectionComponent, this.#movieListComponent, RenderPosition.BEFORE_END);

    this.#renderBoard();
  }

  #sortMovies = (sortType) => {
    switch (sortType) {
      case SortType.BY_DATE:
        this.#movies.sort(sortByYear);
        break;
      case SortType.BY_RATING:
        this.#movies.sort(sortByRating);
        break;
      default: this.#movies = [...this.#sourcedMovies];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#sortMovies(sortType);
    this.#clearMovieList();
    this.#renderMovieList();
  }

  #renderSort = () => {
    render(this.#container, this.#sortComponent, RenderPosition.AFTER_BEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderMovieCard = (movie, container) => {
    const prevMovieCardComponent = this.#moviesComponents.get(movie.id);

    const movieCardComponent = new MovieCardView(movie);

    this.#moviesComponents.set(movie.id, movieCardComponent);

    const openPopupClickHandler = () => {
      this.#siteBodyElement.classList.add('hide-overflow');
      this.#renderPopup(movie, this.#comments);
    };

    movieCardComponent.setOpenPopupClickHandler(openPopupClickHandler);
    movieCardComponent.setAddToWatchClickHandler(this.#addToWatchClickHandler, movie);
    movieCardComponent.setMarkAsWatchedClickHandler(this.#markAsWatchedClickHandler, movie);
    movieCardComponent.setAddToFavoriteClickHandler(this.#addToFavoriteClickHandler, movie);

    if (!prevMovieCardComponent) {
      render(container, movieCardComponent, RenderPosition.BEFORE_END);
    } else {
      replace(movieCardComponent, prevMovieCardComponent);
      remove(prevMovieCardComponent);

      if (this.#moviePopupComponent !== null) {
        this.#popupScrollPosition = this.#moviePopupComponent.element.scrollTop;
        this.#renderPopup(movie, this.#comments);
      }
    }
  }

  #renderPopup = (movie, allComments) => {
    const prevMoviePopupComponent = this.#moviePopupComponent;

    const filteredComments = allComments.filter(({id}) => movie.comments.includes(id));

    this.#moviePopupComponent = new MoviePopupView(movie, filteredComments);

    document.addEventListener('keydown', this.#onEscKeyKeyDown);

    this.#moviePopupComponent.setClosePopupClickHandler(this.#closePopupClickHandler);
    this.#moviePopupComponent.setAddToWatchClickHandler(this.#addToWatchClickHandler, movie);
    this.#moviePopupComponent.setMarkAsWatchedClickHandler(this.#markAsWatchedClickHandler, movie);
    this.#moviePopupComponent.setAddToFavoriteClickHandler(this.#addToFavoriteClickHandler, movie);

    render(this.#siteBodyElement, this.#moviePopupComponent, RenderPosition.AFTER_END);

    this.#moviePopupComponent.element.scrollTop = this.#popupScrollPosition;

    if (prevMoviePopupComponent !== null) {
      remove(prevMoviePopupComponent);
      this.#popupScrollPosition = null;
    }
  }

  #addToWatchClickHandler = (movie) => {
    this.#updateMovie({...movie, isInWatchlist: !movie.isInWatchlist});
  };

  #markAsWatchedClickHandler = (movie) => {
    this.#updateMovie({...movie, isWatched: !movie.isWatched});
  };

  #addToFavoriteClickHandler = (movie) => {
    this.#updateMovie({...movie, isFavorite: !movie.isFavorite});
  };

  #onEscKeyKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hidePopup();
      document.removeEventListener('keydown', this.#onEscKeyKeyDown);
    }
  };

  #hidePopup = () => {
    if (this.#moviePopupComponent !== null) {
      remove(this.#moviePopupComponent);
    }

    this.#moviePopupComponent = null;
    this.#siteBodyElement.classList.remove('hide-overflow');
  };

  #closePopupClickHandler = () => {
    this.#hidePopup();
    document.removeEventListener('keydown', this.#onEscKeyKeyDown);
  };

  #renderNoMovies = () => {
    render(this.#movieListComponent, this.#noMoviesComponent, RenderPosition.BEFORE_END);
  }

  #renderMovies = (from, to, container) => {
    this.#movies
      .slice(from, to)
      .forEach((movie) => this.#renderMovieCard(movie, container));
  }

  #loadMoreButtonClickHandler = () => {
    this.#movies.slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovieCard(movie, this.#movieListContainerComponent));

    this.#renderedMoviesCount += MOVIE_COUNT_PER_STEP;

    if (this.#renderedMoviesCount >= this.#movies.length) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  #renderLoadMoreButton = () => {
    render(this.#movieListComponent, this.#loadMoreButtonComponent, RenderPosition.BEFORE_END);
    this.#loadMoreButtonComponent.setLoadMoreClickHandler(this.#loadMoreButtonClickHandler);
  }

  #renderMovieCountStatistic = () => {
    render(this.#footerStatisticsElement, new MoviesCountView(this.#movies.length), RenderPosition.AFTER_END);
  }

  #renderMovieList = () => {
    render(this.#movieListComponent, this.#movieListContainerComponent, RenderPosition.BEFORE_END);
    this.#renderMovies(0, Math.min(this.#movies.length, MOVIE_COUNT_PER_STEP), this.#movieListContainerComponent);

    if (this.#movies.length > MOVIE_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }

  #clearMovieList = () => {
    this.#moviesComponents.forEach((movie) => remove(movie));
    this.#moviesComponents.clear();
    this.#renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  #updateMovie = (updatedMovie) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    this.#sourcedMovies = updateItem(this.#sourcedMovies, updatedMovie);
    this.#renderMovieCard(updatedMovie, this.#movieListContainerComponent);
  }

  #renderBoard = () => {
    if (!this.#movies.length) {
      this.#renderNoMovies();
      return;
    }

    this.#renderSort();

    this.#renderMovieList();

    this.#renderMovieCountStatistic();
  }
}
