import {RenderPosition} from './render';
import {createMovieCardTemplate} from './view/movie-card-view';
import {createSiteMenuTemplate} from './view/site-menu-view';
import {createLoadMoreButtonTemplate} from './view/load-more-button-view';
import {createUserRankTemplate} from './view/user-rank-view';
import {createMoviePopupTemplate} from './view/movie-popup-view';
import {createMoviesCountTemplate} from './view/movies-count-view';
import {createMovieCommentsTemplate} from './view/movie-comments-view';

const MOVIE_COUNT = 5;

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const moviesSectionElement = document.querySelector('.films');
const movieListElement = document.querySelector('.films-list');
const movieListExtraElements = document.querySelectorAll('.films-list--extra');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const renderTemplate = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

const createContainer = (tagName, className) => {
  const result = document.createElement(tagName);
  result.classList.add(className);
  return result;
};

renderTemplate(siteHeaderElement, createUserRankTemplate(), RenderPosition.BEFORE_END);

renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.AFTER_BEGIN);

const movieListContainerElement = createContainer('div', 'films-list__container');

for (let i = 0; i < MOVIE_COUNT; i++) {
  renderTemplate(movieListContainerElement, createMovieCardTemplate(), RenderPosition.AFTER_BEGIN);
}
moviesSectionElement.querySelector('.films-list').appendChild(movieListContainerElement);

renderTemplate(movieListElement, createLoadMoreButtonTemplate(), RenderPosition.BEFORE_END);

movieListExtraElements.forEach((element) => {
  const container = element.querySelector('.films-list__container');
  renderTemplate(container, createMovieCardTemplate(), RenderPosition.AFTER_BEGIN);
});

renderTemplate(siteFooterElement, createMoviePopupTemplate(), RenderPosition.AFTER_END);

const filmDetailsBottomContainerElement = document.querySelector('.film-details__bottom-container');

renderTemplate(filmDetailsBottomContainerElement, createMovieCommentsTemplate(), RenderPosition.BEFORE_END);

renderTemplate(footerStatisticsElement, createMoviesCountTemplate(), RenderPosition.AFTER_END);
