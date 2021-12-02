import {renderElement, RenderPosition} from './render';
import {MovieCardView} from './view/movie-card-view';
import {SiteMenuView} from './view/site-menu-view';
import {LoadMoreButtonView} from './view/load-more-button-view';
import {UserRankView} from './view/user-rank-view';
import {moviePopupView} from './view/movie-popup-view';
import {MoviesCountView} from './view/movies-count-view';
import {MovieCommentsView} from './view/movie-comments-view';
import {generateMovie, generateComment} from './mock/movie';
import {generateMoviesFilter} from './filter';
import {createContainer} from './utils';

const MOVIE_COUNT = 17;
const MOVIE_COUNT_PER_STEP = 5;

const movies = Array.from({length: MOVIE_COUNT}, generateMovie);
const filteredMovies = generateMoviesFilter(movies);

const commentsList = [];

movies.map((movie, index) => {
  commentsList.push(generateComment(index));
});

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const moviesSectionElement = document.querySelector('.films');
const movieListElement = document.querySelector('.films-list');
const movieListExtraElements = document.querySelectorAll('.films-list--extra');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

renderElement(siteHeaderElement, new UserRankView().element, RenderPosition.BEFORE_END);

renderElement(siteMainElement, new SiteMenuView(filteredMovies).element, RenderPosition.AFTER_BEGIN);

const movieListContainerElement = createContainer('div', 'films-list__container');

for (let i = 0; i < Math.min(movies.length, MOVIE_COUNT_PER_STEP); i++) {
  renderElement(movieListContainerElement, new MovieCardView(movies[i]).element, RenderPosition.BEFORE_END);
}
moviesSectionElement.querySelector('.films-list').appendChild(movieListContainerElement);

movieListExtraElements.forEach((element, index) => {
  const container = element.querySelector('.films-list__container');
  renderElement(container, new MovieCardView(movies[index]).element, RenderPosition.AFTER_BEGIN);
});

renderElement(siteFooterElement, new moviePopupView(movies[0]).element, RenderPosition.AFTER_END);

const filmDetailsBottomContainerElement = document.querySelector('.film-details__bottom-container');

renderElement(filmDetailsBottomContainerElement, new MovieCommentsView(movies[0], commentsList).element, RenderPosition.BEFORE_END);

renderElement(footerStatisticsElement, new MoviesCountView().element, RenderPosition.AFTER_END);

if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMoviesCount = MOVIE_COUNT_PER_STEP;

  renderElement(movieListElement, new LoadMoreButtonView().element, RenderPosition.BEFORE_END);

  const loadMoreButton = document.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies.slice(renderedMoviesCount, renderedMoviesCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => {
        renderElement(movieListContainerElement, new MovieCardView(movie).element, RenderPosition.BEFORE_END);
      });

    renderedMoviesCount += MOVIE_COUNT_PER_STEP;

    if (renderedMoviesCount >= movies.length) {
      loadMoreButton.remove();
    }
  });
}

