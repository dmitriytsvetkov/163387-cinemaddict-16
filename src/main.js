import {RenderPosition} from './render';
import {createMovieCardTemplate} from './view/movie-card-view';
import {createSiteMenuTemplate} from './view/site-menu-view';
import {createLoadMoreButtonTemplate} from './view/load-more-button-view';
import {createUserRankTemplate} from './view/user-rank-view';
import {createMoviePopupTemplate} from './view/movie-popup-view';
import {createMoviesCountTemplate} from './view/movies-count-view';
import {createMovieCommentsTemplate} from './view/movie-comments-view';
import {generateMovie, generateComment} from './mock/movie';
import {generateMoviesFilter} from './filter';
import {renderTemplate, createContainer} from './utils';

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

renderTemplate(siteHeaderElement, createUserRankTemplate(), RenderPosition.BEFORE_END);

renderTemplate(siteMainElement, createSiteMenuTemplate(filteredMovies), RenderPosition.AFTER_BEGIN);

const movieListContainerElement = createContainer('div', 'films-list__container');

for (let i = 0; i < Math.min(movies.length, MOVIE_COUNT_PER_STEP); i++) {
  renderTemplate(movieListContainerElement, createMovieCardTemplate(movies[i]), RenderPosition.BEFORE_END);
}
moviesSectionElement.querySelector('.films-list').appendChild(movieListContainerElement);

movieListExtraElements.forEach((element, index) => {
  const container = element.querySelector('.films-list__container');
  renderTemplate(container, createMovieCardTemplate(movies[index]), RenderPosition.AFTER_BEGIN);
});

renderTemplate(siteFooterElement, createMoviePopupTemplate(movies[0]), RenderPosition.AFTER_END);

const filmDetailsBottomContainerElement = document.querySelector('.film-details__bottom-container');

renderTemplate(filmDetailsBottomContainerElement, createMovieCommentsTemplate(movies[0], commentsList), RenderPosition.BEFORE_END);

renderTemplate(footerStatisticsElement, createMoviesCountTemplate(), RenderPosition.AFTER_END);

if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMoviesCount = MOVIE_COUNT_PER_STEP;

  renderTemplate(movieListElement, createLoadMoreButtonTemplate(), RenderPosition.BEFORE_END);

  const loadMoreButton = document.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movies.slice(renderedMoviesCount, renderedMoviesCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => {
        renderTemplate(movieListContainerElement, createMovieCardTemplate(movie), RenderPosition.AFTER_BEGIN);
      });

    renderedMoviesCount += MOVIE_COUNT_PER_STEP;

    if (renderedMoviesCount >= movies.length) {
      loadMoreButton.remove();
    }
  });
}

