import {FilterType, SortType, UpdateType, UserAction} from '../constants';
import {remove, render, RenderPosition, replace} from '../utils/render';
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
import {filter} from '../utils/filter';

const MOVIE_COUNT_PER_STEP = 5;

export default class MoviesBoardPresenter {
  #container = null;
  #moviesModel = null;
  #filterModel = null;
  #filterType = FilterType.ALL;
  #currentSortType = SortType.DEFAULT;
  #comments = [];
  #moviesComponents = new Map();
  #popupScrollPosition = null;

  #renderedMoviesCount = MOVIE_COUNT_PER_STEP;

  #moviesSectionComponent = new MoviesSectionView();
  #movieListComponent = new MovieListView();
  #movieListContainerComponent = new MovieListContainerView();
  #noMoviesComponent = null;
  #moviePopupComponent = null;
  #sortComponent = null;
  #loadMoreButtonComponent = null;
  #moviesCountComponent = null;
  #lastOpenedMovie = null;

  #siteBodyElement = document.querySelector('body');
  #siteFooterElement = this.#siteBodyElement.querySelector('.footer');
  #footerStatisticsElement = this.#siteFooterElement.querySelector('.footer__statistics');


  constructor(listContainer, moviesModel, filterModel) {
    this.#container = listContainer;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
  }

  get movies() {
    this.#filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = filter[this.#filterType](movies);

    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return filteredMovies.sort(sortByYear);
      case SortType.BY_RATING:
        return filteredMovies.sort(sortByRating);
    }

    return filteredMovies;
  }

  init = (comments) => {
    this.#comments = [...comments];

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  }

  destroy = () => {
    this.#clearBoard({resetRenderedMoviesCount:true, resetSortType: true});

  }

  #handleViewAction = (actionType, updateType, updatedMovie) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, updatedMovie);
        break;
    }
  }

  #handleFormSubmit = (update) => {
    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      update,
    );
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH :
        this.#renderMovieCard(data);
        break;
      case UpdateType.MINOR :
        this.#clearBoard();
        this.#lastOpenedMovie = data;
        this.#renderBoard();
        break;
      case UpdateType.MAJOR :
        this.#clearBoard({resetRenderedMoviesCount:true, resetSortType:true});
        this.#renderBoard();
        break;
      case UpdateType.RE_INIT :
        this.#clearBoard({resetRenderedMoviesCount:true, resetSortType:true});
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedMoviesCount: true});
    this.#renderBoard();
  }

  #renderMovies = (movies) => {
    render(this.#movieListComponent, this.#movieListContainerComponent, RenderPosition.AFTER_BEGIN);
    movies.forEach((movie) => this.#renderMovieCard(movie));
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#container, this.#sortComponent, RenderPosition.AFTER_BEGIN);
  }

  #renderMovieCard = (movie) => {
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
      render(this.#movieListContainerComponent, movieCardComponent, RenderPosition.BEFORE_END);
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
    this.#moviePopupComponent.setAddToWatchClickHandler(this.#addToWatchClickHandler);
    this.#moviePopupComponent.setMarkAsWatchedClickHandler(this.#markAsWatchedClickHandler);
    this.#moviePopupComponent.setAddToFavoriteClickHandler(this.#addToFavoriteClickHandler);
    this.#moviePopupComponent.setDeleteCommentClickHandler(this.#handleDeleteClick);
    this.#moviePopupComponent.setFormSubmitClickHandler(this.#handleFormSubmit);

    render(this.#siteBodyElement, this.#moviePopupComponent, RenderPosition.AFTER_END);

    this.#moviePopupComponent.element.scrollTop = this.#popupScrollPosition;

    if (prevMoviePopupComponent !== null) {
      remove(prevMoviePopupComponent);
      this.#popupScrollPosition = null;
    }
  }

  #handleDeleteClick = (movie, index) => {
    const {comments} = movie;
    const filteredComments = comments.filter((comment) => comment.toString() !== index);
    movie.comments.splice(index, 1);

    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      {...movie, comments: filteredComments}
    );
  }

  #addToWatchClickHandler = (movie) => {
    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...movie, isInWatchlist: !movie.isInWatchlist},
    );
  };

  #markAsWatchedClickHandler = (movie) => {
    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...movie, isWatched: !movie.isWatched},
    );
  };

  #addToFavoriteClickHandler = (movie) => {
    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...movie, isFavorite: !movie.isFavorite},
    );
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
    this.#noMoviesComponent = new NoMoviesView(this.#filterType);
    render(this.#movieListComponent, this.#noMoviesComponent, RenderPosition.BEFORE_END);
  }

  #handleLoadMoreButtonClick = () => {
    const moviesCount = this.movies.length;
    const newRenderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount + MOVIE_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedMoviesCount, newRenderedMoviesCount);
    this.#renderMovies(movies);

    this.#renderedMoviesCount = newRenderedMoviesCount;

    if (this.#renderedMoviesCount >= moviesCount) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new LoadMoreButtonView();
    this.#loadMoreButtonComponent.setLoadMoreClickHandler(this.#handleLoadMoreButtonClick);

    render(this.#movieListComponent, this.#loadMoreButtonComponent, RenderPosition.BEFORE_END);
  }

  #renderMovieCount = (moviesCount) => {
    this.#moviesCountComponent = new MoviesCountView(moviesCount);
    render(this.#footerStatisticsElement, this.#moviesCountComponent, RenderPosition.AFTER_END);
  }

  #renderBoard = () => {
    render(this.#container, this.#moviesSectionComponent, RenderPosition.BEFORE_END);
    render(this.#moviesSectionComponent, this.#movieListComponent, RenderPosition.BEFORE_END);
    const movies = this.movies;
    const movieCount = movies.length;

    if (movieCount === 0) {
      this.#renderNoMovies();
      return;
    }

    this.#renderSort();

    this.#renderMovies(movies.slice(0, Math.min(movieCount, this.#renderedMoviesCount)));

    if (this.#moviePopupComponent !== null && this.#moviePopupComponent.movieData.id === this.#lastOpenedMovie.id) {
      this.#moviePopupComponent.updateData(this.#lastOpenedMovie);
    }

    if (movieCount > this.#renderedMoviesCount) {
      this.#renderLoadMoreButton();
    }

    this.#renderMovieCount(movieCount);
  }

  #clearBoard = ({resetRenderedMoviesCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;

    this.#moviesComponents.forEach((movie) => remove(movie));
    this.#moviesComponents.clear();

    remove(this.#moviesSectionComponent);
    remove(this.#movieListComponent);
    remove(this.#loadMoreButtonComponent);
    remove(this.#sortComponent);
    remove(this.#moviesCountComponent);

    if (this.#noMoviesComponent) {
      remove(this.#noMoviesComponent);
    }

    if (resetRenderedMoviesCount) {
      this.#renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    } else {
      this.#renderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }
}
