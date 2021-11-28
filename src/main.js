import {RenderPosition} from './render';
import {createMovieCardTemplate} from './view/movie-card-view';
import {createSiteMenuTemplate} from './view/site-menu-view';
import {createLoadMoreButtonTemplate} from './view/load-more-button-view';
import {createUserRankTemplate} from './view/user-rank-view';
import {createMoviePopupTemplate} from './view/movie-popup-view';
import {createMoviesCountTemplate} from './view/movies-count-view';
import {createMovieCommentsTemplate} from './view/movie-comments-view';
import {generateMovie} from './mock/movie';
import {generateFilter} from './filter';
import {renderTemplate, createContainer} from './utils';

const MOVIE_COUNT = 17;

const movies = Array.from({length: MOVIE_COUNT}, generateMovie);
const filteredMovies = generateFilter(movies);

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

for (let i = 0; i < MOVIE_COUNT; i++) {
  renderTemplate(movieListContainerElement, createMovieCardTemplate(movies[i]), RenderPosition.AFTER_BEGIN);
}
moviesSectionElement.querySelector('.films-list').appendChild(movieListContainerElement);

renderTemplate(movieListElement, createLoadMoreButtonTemplate(), RenderPosition.BEFORE_END);

movieListExtraElements.forEach((element, index) => {
  const container = element.querySelector('.films-list__container');
  renderTemplate(container, createMovieCardTemplate(movies[index]), RenderPosition.AFTER_BEGIN);
});

renderTemplate(siteFooterElement, createMoviePopupTemplate(movies[0]), RenderPosition.AFTER_END);

const filmDetailsBottomContainerElement = document.querySelector('.film-details__bottom-container');

renderTemplate(filmDetailsBottomContainerElement, createMovieCommentsTemplate(), RenderPosition.BEFORE_END);

renderTemplate(footerStatisticsElement, createMoviesCountTemplate(), RenderPosition.AFTER_END);


