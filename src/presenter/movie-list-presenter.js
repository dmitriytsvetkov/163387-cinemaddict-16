import MoviesSectionView from '../view/movies-section-view';
import MovieListView from '../view/movie-list-view';
import {remove, render, RenderPosition} from '../utils/render';
import NoMoviesView from '../view/no-movies-view';
import LoadMoreButtonView from '../view/load-more-button-view';
import SortView from '../view/sort-view';
import MovieListContainerView from '../view/movie-list-container-view';
import MovieCardView from '../view/movie-card-view';
import MoviePopupView from '../view/movie-popup-view';
import MovieCommentsView from '../view/movie-comments-view';
import MoviesCountView from '../view/movies-count-view';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #container = null;
  #movies = [];
  #comments = [];

  #moviesSectionComponent = new MoviesSectionView();
  #movieListComponent = new MovieListView();
  #movieListContainerComponent = new MovieListContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();

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

    this.#renderMovieList();
  }

  #renderSort = () => {
    render(this.#container, new SortView(), RenderPosition.AFTER_BEGIN);
  }

  #renderMovie = (movie) => {
    const movieComponent = new MovieCardView(movie);
    const moviePopupComponent = new MoviePopupView(movie);

    const showPopup = () => {
      render(this.#container, moviePopupComponent, RenderPosition.AFTER_END);
      const filmDetailsBottomContainerElement = document.querySelector('.film-details__bottom-container');
      render(filmDetailsBottomContainerElement, new MovieCommentsView(movie, this.#comments), RenderPosition.BEFORE_END);
    };

    const hidePopup = () => {
      this.#container.nextSibling.remove();
      this.#siteBodyElement.classList.remove('hide-overflow');
    };

    const onEscKeyKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        hidePopup();
        document.removeEventListener('keydown', onEscKeyKeyDown);
      }
    };

    movieComponent.setEditClickHandler(() => {
      this.#siteBodyElement.classList.add('hide-overflow');
      showPopup();
      document.addEventListener('keydown', onEscKeyKeyDown);
    });

    moviePopupComponent.setClosePopupClickHandler(() => {
      hidePopup();
      document.removeEventListener('keydown', onEscKeyKeyDown);
    });

    render(this.#movieListContainerComponent, movieComponent, RenderPosition.BEFORE_END);
  }

  #renderNoMovies = () => {
    render(this.#movieListComponent, new NoMoviesView(), RenderPosition.BEFORE_END);
  }

  #renderMovies = (from, to) => {
    this.#movies
      .slice(from, to)
      .forEach((movie) => this.#renderMovie(movie));
  }

  #renderShowMoreButton = () => {

    render(this.#movieListComponent, this.#loadMoreButtonComponent, RenderPosition.BEFORE_END);

    let renderedMoviesCount = MOVIE_COUNT_PER_STEP;

    this.#loadMoreButtonComponent.setLoadMoreClickHandler(() => {
      this.#movies.slice(renderedMoviesCount, renderedMoviesCount + MOVIE_COUNT_PER_STEP).forEach((movie) => this.#renderMovie(movie));

      renderedMoviesCount += MOVIE_COUNT_PER_STEP;

      if (renderedMoviesCount >= this.#movies.length) {
        remove(this.#loadMoreButtonComponent);
      }
    });
  }

  #renderTopRatedMovie = () => {

  }

  #renderMostCommentedMovie = () => {

  }

  #renderMovieCountStatistic = () => {
    render(this.#footerStatisticsElement, new MoviesCountView(this.#movies.length), RenderPosition.AFTER_END);
  }

  #renderMovieList = () => {
    if (!this.#movies.length) {
      this.#renderNoMovies();
      return;
    }

    this.#renderSort();

    render(this.#movieListComponent, this.#movieListContainerComponent, RenderPosition.BEFORE_END);

    this.#renderMovies(0, Math.min(this.#movies.length, MOVIE_COUNT_PER_STEP));

    /*movieListExtraElements.forEach((element, index) => {
      const container = element.querySelector('.films-list__container');
      renderMovie(container, movies[index]);
    });*/

    if (this.#movies.length > MOVIE_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }

    this.#renderMovieCountStatistic();
  }

}
