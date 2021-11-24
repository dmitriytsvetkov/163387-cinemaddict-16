import {renderTemplate, RenderPosition} from './render';
import {createMovieCardTemplate} from './view/movie-card-view';
import {createSiteMenuTemplate} from './view/site-menu-view';
import {createLoadMoreButtonTemplate} from './view/load-more-button-view';
import {createUserRankTemplate} from './view/user-rank-view';
import {createMoviePopupTemplate} from './view/movie-popup-view';
import {createMoviesCountTemplate} from './view/movies-count-view';

const MOVIE_COUNT = 5;

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const movieListElement = document.querySelector('.films-list');
const movieListExtraElements = document.querySelectorAll('.films-list--extra');
const movieListContainerElement = movieListElement.querySelector('.films-list__container');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

renderTemplate(siteHeaderElement, createUserRankTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN);

for (let i = 0; i < MOVIE_COUNT; i++) {
  renderTemplate(movieListContainerElement, createMovieCardTemplate(), RenderPosition.AFTERBEGIN);
}

renderTemplate(movieListElement, createLoadMoreButtonTemplate(), RenderPosition.BEFOREEND);

movieListExtraElements.forEach((element) => {
  const container = element.querySelector('.films-list__container');
  renderTemplate(container, createMovieCardTemplate(), RenderPosition.AFTERBEGIN);
});

renderTemplate(siteFooterElement, createMoviePopupTemplate(), RenderPosition.AFTEREND);
renderTemplate(footerStatisticsElement, createMoviesCountTemplate(), RenderPosition.AFTEREND);
