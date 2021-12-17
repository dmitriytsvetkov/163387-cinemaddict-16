import MoviesSectionView from '../view/movies-section-view';
import MovieListView from '../view/movie-list-view';
import MovieListExtraView from '../view/movie-list-extra-view';
import {remove, render, RenderPosition, replace} from '../utils/render';
import NoMoviesView from '../view/no-movies-view';
import LoadMoreButtonView from '../view/load-more-button-view';
import SortView from '../view/sort-view';
import MovieListContainerView from '../view/movie-list-container-view';
import MoviesCountView from '../view/movies-count-view';
import {updateItem} from '../utils/common';
import MovieCardView from '../view/movie-card-view';
import MoviePopupView from '../view/movie-popup-view';
import MovieCommentsView from '../view/movie-comments-view';

const MOVIE_COUNT_PER_STEP = 5;

export default class MoviesBoardPresenter {
  #container = null;
  #movies = [];
  #comments = [];
  #moviesComponents = new Map();

  #renderedMoviesCount = MOVIE_COUNT_PER_STEP;

  #moviesSectionComponent = new MoviesSectionView();
  #movieListComponent = new MovieListView();
  #movieListContainerComponent = new MovieListContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #noMoviesComponent = new NoMoviesView();
  #moviePopupComponent = null;

  #siteBodyElement = document.querySelector('body');
  #siteFooterElement = this.#siteBodyElement.querySelector('.footer');
  #footerStatisticsElement = this.#siteFooterElement.querySelector('.footer__statistics');


  constructor(listContainer) {
    this.#container = listContainer;
  }

  init = (movies, comments) => {
    this.#movies = [...movies];
    this.#comments = [...comments];
    render(this.#container, this.#moviesSectionComponent, RenderPosition.BEFORE_END);
    render(this.#moviesSectionComponent, this.#movieListComponent, RenderPosition.BEFORE_END);

    this.#renderBoard();
  }

  #renderSort = () => {
    render(this.#container, new SortView(), RenderPosition.AFTER_BEGIN);
  }

  #renderMovieCard = (movie, container) => {
    const prevMovieCardComponent = this.#moviesComponents.get(movie.id);

    const movieCardComponent = new MovieCardView(movie);

    this.#moviesComponents.set(movie.id, movieCardComponent);

    const addToWatchClickHandler = () => {
      this.#updateMovie({...movie, isInWatchlist: !movie.isInWatchlist});
    };

    const markAsWatchedClickHandler = () => {
      this.#updateMovie({...movie, isWatched: !movie.isWatched});
    };

    const addToFavoriteClickHandler = () => {
      this.#updateMovie({...movie, isFavorite: !movie.isFavorite});
    };

    const openPopupClickHandler = () => {
      this.#siteBodyElement.classList.add('hide-overflow');
      this.#renderPopup(movie, this.#comments);
    };

    movieCardComponent.setEditClickHandler(openPopupClickHandler);
    movieCardComponent.setAddToWatchClickHandler(addToWatchClickHandler);
    movieCardComponent.setMarkAsWatchedClickHandler(markAsWatchedClickHandler);
    movieCardComponent.setAddToFavoriteClickHandler(addToFavoriteClickHandler);

    if (!prevMovieCardComponent) {
      render(container, movieCardComponent, RenderPosition.BEFORE_END);
    } else {
      replace(movieCardComponent, prevMovieCardComponent);
      remove(prevMovieCardComponent);

      if (this.#moviePopupComponent !== null) {
        this.#renderPopup(movie, this.#comments);
      }
    }
  }

  #renderPopup = (movie, comments) => {
    const prevMoviePopupComponent = this.#moviePopupComponent;

    this.#moviePopupComponent = new MoviePopupView(movie);

    const movieCommentsComponent = new MovieCommentsView(movie, comments);

    const hidePopup = () => {
      if (this.#moviePopupComponent !== null) {
        remove(this.#moviePopupComponent);
      }

      this.#moviePopupComponent = null;
      this.#siteBodyElement.classList.remove('hide-overflow');
    };

    const onEscKeyKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        hidePopup();
        document.removeEventListener('keydown', onEscKeyKeyDown);
      }
    };

    const closePopupClickHandler = () => {
      hidePopup();
      document.removeEventListener('keydown', onEscKeyKeyDown);
    };

    document.addEventListener('keydown', onEscKeyKeyDown);

    const addToWatchClickHandler = () => {
      this.#updateMovie({...movie, isInWatchlist: !movie.isInWatchlist});
    };

    const markAsWatchedClickHandler = () => {
      this.#updateMovie({...movie, isWatched: !movie.isWatched});
    };

    const addToFavoriteClickHandler = () => {
      this.#updateMovie({...movie, isFavorite: !movie.isFavorite});
    };

    this.#moviePopupComponent.setClosePopupClickHandler(closePopupClickHandler);
    this.#moviePopupComponent.setAddToWatchClickHandler(addToWatchClickHandler);
    this.#moviePopupComponent.setMarkAsWatchedClickHandler(markAsWatchedClickHandler);
    this.#moviePopupComponent.setAddToFavoriteClickHandler(addToFavoriteClickHandler);

    render(this.#siteBodyElement, this.#moviePopupComponent, RenderPosition.AFTER_END);
    const filmDetailsBottomContainerElement = this.#moviePopupComponent.element.querySelector('.film-details__bottom-container');
    render(filmDetailsBottomContainerElement, movieCommentsComponent, RenderPosition.BEFORE_END);
    if (prevMoviePopupComponent !== null) {
      remove(prevMoviePopupComponent);
    }

  }

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

  #renderTopRatedMovies = () => {
    const movieListExtraComponent = new MovieListExtraView('Top rated');
    render(this.#moviesSectionComponent, movieListExtraComponent, RenderPosition.BEFORE_END);
    const movieListContainerComponent = new MovieListContainerView();
    render(movieListExtraComponent, movieListContainerComponent, RenderPosition.BEFORE_END);
    this.#renderMovies(0, Math.min(this.#movies.length, 2), movieListContainerComponent);
  }

  #renderMostCommentedMovies = () => {
    const movieListExtraComponent = new MovieListExtraView('Most commented');
    render(this.#moviesSectionComponent, movieListExtraComponent, RenderPosition.BEFORE_END);
    const movieListContainerComponent = new MovieListContainerView();
    render(movieListExtraComponent, movieListContainerComponent, RenderPosition.BEFORE_END);
    this.#renderMovies(0, Math.min(this.#movies.length, 2), movieListContainerComponent);
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
    this.#moviesComponents.forEach((movie) => movie.destroy());
    this.#moviesComponents.clear();
    this.#renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  #updateMovie = (updatedMovie) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    this.#renderMovieCard(updatedMovie, this.#movieListContainerComponent);
  }

  #renderBoard = () => {
    if (!this.#movies.length) {
      this.#renderNoMovies();
      return;
    }

    this.#renderSort();

    this.#renderMovieList();

    /*this.#renderTopRatedMovies();
    this.#renderMostCommentedMovies();*/

    this.#renderMovieCountStatistic();
  }
}
