import {FilterType, SortType, State, UpdateType, UserAction} from '../constants';
import {remove, render, RenderPosition, replace} from '../utils/render';
import {sortByYear, sortByRating} from '../utils/movie-utils';
import MoviesSectionView from '../view/movies-section-view';
import MovieListView from '../view/movie-list-view';
import NoMoviesView from '../view/no-movies-view';
import LoadMoreButtonView from '../view/load-more-button-view';
import SortView from '../view/sort-view';
import MovieCardView from '../view/movie-card-view';
import MoviePopupView from '../view/movie-popup-view';
import {filter} from '../utils/filter';
import {removeItem} from '../utils/common';
import LoadingView from '../view/loading-view';
import UserRankView from '../view/user-rank-view';
import MovieListContainerView from '../view/movie-list-container-view';

const MOVIE_COUNT_PER_STEP = 5;

export default class MoviesBoardPresenter {
  #container = null;
  #moviesModel = null;
  #filterModel = null;
  #commentsModel = null;
  #popupScrollPosition = null;
  #filterType = FilterType.ALL;
  #currentSortType = SortType.DEFAULT;
  #moviesComponents = new Map();

  #renderedMoviesCount = MOVIE_COUNT_PER_STEP;

  #moviesSectionComponent = new MoviesSectionView();
  #movieListComponent = new MovieListView();
  #movieListContainerComponent = new MovieListContainerView();
  #loadingComponent = new LoadingView();
  #noMoviesComponent = null;
  #moviePopupComponent = null;
  #profileComponent = null;
  #sortComponent = null;
  #loadMoreButtonComponent = null;
  #moviesCountComponent = null;
  #isLoading = true;

  #siteBodyElement = document.querySelector('body');
  #siteHeaderElement = this.#siteBodyElement.querySelector('.header');

  constructor(listContainer, moviesModel, filterModel, commentsModel) {
    this.#container = listContainer;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
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

  get comments() {
    return this.#commentsModel.comments;
  }

  init = () => {
    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  }

  destroy = () => {
    this.#clearBoard({resetRenderedMoviesCount:true, resetSortType: true});

    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }

    this.#moviesModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleModelEvent);

    this.#filterModel.setFilter(UpdateType.MAJOR, null);
  }

  #handleViewAction = async (actionType, updateType, updatedMovie, updatedComment) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, updatedMovie);
        break;
      case UserAction.DELETE_COMMENT:
        this.setPopupState(State.DELETING, updatedComment.id);

        try {
          await this.#commentsModel.deleteComment(updatedComment);
          await this.#moviesModel.updateMovie(updateType, updatedMovie);
        } catch(err) {
          this.setPopupState(State.ABORTING, updatedComment.id);
        }
        break;
      case UserAction.ADD_COMMENT:
        this.setPopupState(State.SAVING);

        try {
          await this.#commentsModel.addComment(updatedComment, updatedMovie);
          await this.#moviesModel.updateMovie(updateType, updatedMovie);
        } catch(err) {
          this.setPopupState(State.ABORTING);
        }
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH :
        this.#renderMovieCard(data);
        this.#moviePopupComponent.restorePrevScroll(this.#popupScrollPosition);
        break;
      case UpdateType.MINOR :
        this.#clearBoard();
        this.#renderBoard();

        if (this.#moviePopupComponent) {
          this.#renderPopup(data);
          this.#moviePopupComponent.restorePrevScroll(this.#popupScrollPosition);
        }

        if (this.#profileComponent) {
          remove(this.#profileComponent);
          this.#profileComponent = new UserRankView(filter[FilterType.HISTORY](this.#moviesModel.movies).length);
          render(this.#siteHeaderElement, this.#profileComponent, RenderPosition.BEFORE_END);
        }

        break;
      case UpdateType.MAJOR :
        this.#clearBoard({resetRenderedMoviesCount:true, resetSortType:true});
        this.#renderBoard();
        break;
      case UpdateType.INIT :
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        this.#profileComponent = new UserRankView(filter[FilterType.HISTORY](this.movies).length);
        render(this.#siteHeaderElement, this.#profileComponent, RenderPosition.BEFORE_END);
        break;
      case UpdateType.COMMENTS_INIT:
        this.#moviePopupComponent.updateComments(this.comments);
        break;
    }
  }

  setPopupState(state, id) {
    switch (state) {
      case State.SAVING:
        this.#moviePopupComponent.updateData({
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#moviePopupComponent.updateData({
          isDeleting: true,
          deletingCommentId: id
        });
        break;
      case State.ABORTING:
        this.#moviePopupComponent.shakeComment(id);
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

  #renderLoading = () => {
    render(this.#movieListComponent, this.#loadingComponent, RenderPosition.BEFORE_END);
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#container, this.#sortComponent, RenderPosition.AFTER_END);
  }

  #renderMovieCard = (movie) => {
    const prevMovieCardComponent = this.#moviesComponents.get(movie.id);

    const movieCardComponent = new MovieCardView(movie);

    this.#moviesComponents.set(movie.id, movieCardComponent);

    const openPopupClickHandler = () => {
      this.#renderPopup(movie, this.comments);
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
        this.#renderPopup(movie, this.comments);
      }
    }
  }

  #closePopup = () => {
    if (this.#moviePopupComponent !== null) {
      remove(this.#moviePopupComponent);
    }

    this.#moviePopupComponent = null;
    this.#siteBodyElement.classList.remove('hide-overflow');
  };

  #renderPopup = (movie) => {
    if (this.#moviePopupComponent) {
      this.#closePopup();
    }

    this.#commentsModel.getComments(movie.id);

    this.#moviePopupComponent = new MoviePopupView(movie, this.comments);

    document.addEventListener('keydown', this.#onEscKeyKeyDown);
    this.#siteBodyElement.classList.add('hide-overflow');

    this.#moviePopupComponent.setClosePopupClickHandler(this.#closePopupClickHandler);
    this.#moviePopupComponent.setAddToWatchClickHandler(this.#addToWatchClickHandler);
    this.#moviePopupComponent.setMarkAsWatchedClickHandler(this.#markAsWatchedClickHandler);
    this.#moviePopupComponent.setAddToFavoriteClickHandler(this.#addToFavoriteClickHandler);
    this.#moviePopupComponent.setDeleteCommentClickHandler(this.#handleDeleteClick);
    this.#moviePopupComponent.setFormSubmitClickHandler(this.#handleFormSubmit);

    render(this.#siteBodyElement, this.#moviePopupComponent, RenderPosition.AFTER_END);
  }

  #handleFormSubmit = ({movie, newComment}) => {
    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      movie,
      newComment
    );

    if (this.#moviePopupComponent) {
      this.#popupScrollPosition = this.#moviePopupComponent.element.scrollTop;
    }
  }

  #handleDeleteClick = (movie, index) => {
    this.#handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {...movie, comments: removeItem(movie.comments, movie.id)},
      {id: index}
    );

    if (this.#moviePopupComponent) {
      this.#popupScrollPosition = this.#moviePopupComponent.element.scrollTop;
    }
  }

  #addToWatchClickHandler = (movie) => {
    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...movie, isInWatchlist: !movie.isInWatchlist},
    );

    if (this.#moviePopupComponent) {
      this.#popupScrollPosition = this.#moviePopupComponent.element.scrollTop;
    }
  };

  #markAsWatchedClickHandler = (movie) => {
    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...movie, isWatched: !movie.isWatched},
    );

    if (this.#moviePopupComponent) {
      this.#popupScrollPosition = this.#moviePopupComponent.element.scrollTop;
    }
  };

  #addToFavoriteClickHandler = (movie) => {
    this.#handleViewAction(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...movie, isFavorite: !movie.isFavorite},
    );

    if (this.#moviePopupComponent) {
      this.#popupScrollPosition = this.#moviePopupComponent.element.scrollTop;
    }

  };

  #onEscKeyKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyKeyDown);
    }
  };

  #closePopupClickHandler = () => {
    this.#closePopup();
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


  #renderBoard = () => {
    render(this.#container, this.#moviesSectionComponent, RenderPosition.AFTER_END);
    render(this.#moviesSectionComponent, this.#movieListComponent, RenderPosition.BEFORE_END);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const movies = this.movies;
    const movieCount = movies.length;

    if (movieCount === 0) {
      this.#renderNoMovies();
      return;
    }

    this.#renderSort();

    this.#renderMovies(movies.slice(0, Math.min(movieCount, this.#renderedMoviesCount)));

    if (movieCount > this.#renderedMoviesCount) {
      this.#renderLoadMoreButton();
    }
  }

  #clearBoard = ({resetRenderedMoviesCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;

    this.#moviesComponents.forEach((movie) => remove(movie));
    this.#moviesComponents.clear();

    if (this.#moviesSectionComponent) {
      remove(this.#moviesSectionComponent);
    }

    if (this.#movieListComponent) {
      remove(this.#movieListComponent);
    }

    if (this.#loadMoreButtonComponent) {
      remove(this.#loadMoreButtonComponent);
    }

    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }

    if (this.#moviesCountComponent) {
      remove(this.#moviesCountComponent);
    }

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
