import {render, RenderPosition} from './render';
import MovieCardView from './view/movie-card-view';
import MovieListView from './view/movie-list.view';
import SiteMenuView from './view/site-menu-view';
import LoadMoreButtonView from './view/load-more-button-view';
import UserRankView from './view/user-rank-view';
import MoviePopupView from './view/movie-popup-view';
import MoviesCountView from './view/movies-count-view';
import MovieCommentsView from './view/movie-comments-view';
import {generateMovie, generateComment} from './mock/movie';
import {generateMoviesFilter} from './filter';

const MOVIE_COUNT = 17;
const MOVIE_COUNT_PER_STEP = 5;

const movies = Array.from({length: MOVIE_COUNT}, generateMovie);
const filteredMovies = generateMoviesFilter(movies);

const commentsList = [];

movies.map((movie, index) => {
  commentsList.push(generateComment(index));
});

const siteBodyElement = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const movieListContainer = document.querySelector('.films-list');
const movieListExtraElements = document.querySelectorAll('.films-list--extra');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const renderMovie = (container, movie) => {
  const movieComponent = new MovieCardView(movie);
  const moviePopupComponent = new MoviePopupView(movie);

  const showPopup = () => {
    render(siteFooterElement, moviePopupComponent.element, RenderPosition.AFTER_END);
    const filmDetailsBottomContainerElement = document.querySelector('.film-details__bottom-container');
    render(filmDetailsBottomContainerElement, new MovieCommentsView(movie, commentsList).element, RenderPosition.BEFORE_END);
  };

  const hidePopup = () => {
    siteFooterElement.nextSibling.remove();
    siteBodyElement.classList.remove('hide-overflow');
  };

  const onEscKeyKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      hidePopup();
      document.removeEventListener('keydown', onEscKeyKeyDown);
    }
  };

  movieComponent.element.addEventListener('click', () => {
    siteBodyElement.classList.add('hide-overflow');
    showPopup();
    document.addEventListener('keydown', onEscKeyKeyDown);
  });

  moviePopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
    hidePopup();
    document.removeEventListener('keydown', onEscKeyKeyDown);
  });

  render(container, movieComponent.element, RenderPosition.BEFORE_END);
};

const movieListComponent = new MovieListView();

render(siteHeaderElement, new UserRankView().element, RenderPosition.BEFORE_END);

render(siteMainElement, new SiteMenuView(filteredMovies).element, RenderPosition.AFTER_BEGIN);

render(movieListContainer, movieListComponent.element, RenderPosition.BEFORE_END);

for (let i = 0; i < Math.min(movies.length, MOVIE_COUNT_PER_STEP); i++) {
  renderMovie(movieListComponent.element, movies[i]);
}

movieListExtraElements.forEach((element, index) => {
  const container = element.querySelector('.films-list__container');
  renderMovie(container, movies[index]);
});

render(footerStatisticsElement, new MoviesCountView().element, RenderPosition.AFTER_END);

if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMoviesCount = MOVIE_COUNT_PER_STEP;

  render(movieListContainer, new LoadMoreButtonView().element, RenderPosition.BEFORE_END);

  const loadMoreButton = document.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies.slice(renderedMoviesCount, renderedMoviesCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => {
        renderMovie(movieListComponent.element, movie);
      });

    renderedMoviesCount += MOVIE_COUNT_PER_STEP;

    if (renderedMoviesCount >= movies.length) {
      loadMoreButton.remove();
    }
  });
}

