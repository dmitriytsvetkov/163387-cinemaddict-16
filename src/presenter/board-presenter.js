import MoviesSectionView from '../view/movies-section-view';
import MovieListView from '../view/movie-list-view';
import MovieListExtraView from '../view/movie-list-extra-view';
import {remove, render, RenderPosition} from '../utils/render';
import NoMoviesView from '../view/no-movies-view';
import LoadMoreButtonView from '../view/load-more-button-view';
import SortView from '../view/sort-view';
import MovieListContainerView from '../view/movie-list-container-view';
import MoviesCountView from '../view/movies-count-view';
import MoviePresenter from './movie-presenter';
import {updateItem} from '../utils/common';

const MOVIE_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #container = null;
  #movies = [];
  #comments = [];
  #moviePresenter = new Map();

  #renderedMoviesCount = MOVIE_COUNT_PER_STEP;

  #moviesSectionComponent = new MoviesSectionView();
  #movieListComponent = new MovieListView();
  #movieListContainerComponent = new MovieListContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #noMoviesComponent = new NoMoviesView();

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

  #renderMovie = (movie, container) => {
    const moviePresenter = new MoviePresenter(container, this.#movieChangeHandler, this.#changeModeHandler);
    moviePresenter.init(movie, this.#comments);

    this.#moviePresenter.set(movie.id, moviePresenter);
  }

  #renderNoMovies = () => {
    render(this.#movieListComponent, this.#noMoviesComponent, RenderPosition.BEFORE_END);
  }

  #renderMovies = (from, to, container) => {
    this.#movies
      .slice(from, to)
      .forEach((movie) => this.#renderMovie(movie, container));
  }

  #loadMoreButtonClickHandler = () => {
    this.#movies.slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie, this.#movieListContainerComponent));

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
    this.#moviePresenter.forEach((movie) => movie.destroy());
    this.#moviePresenter.clear();
    this.#renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  #movieChangeHandler = (updatedMovie) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    this.#moviePresenter.get(updatedMovie.id).init(updatedMovie, this.#comments);
  }

  #changeModeHandler = () => {
    this.#moviePresenter.forEach((movie) => movie.resetView());
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
