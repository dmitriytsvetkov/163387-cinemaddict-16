import {render, RenderPosition} from './utils/render';
import SiteMenuView from './view/site-menu-view';
import UserRankView from './view/user-rank-view';
import {generateMovie, generateComment} from './mock/movie';
import {generateMoviesFilter} from './filter';
import MoviesBoardPresenter from './presenter/movies-board-presenter';

const MOVIE_COUNT = 11;

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');

const movies = Array.from({length: MOVIE_COUNT}, generateMovie);

const filteredMovies = generateMoviesFilter(movies);

const commentsList = [];
movies.map((movie, index) => {
  commentsList.push(generateComment(index));
});

const moviesBoardPresenter = new MoviesBoardPresenter(siteMainElement);

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFORE_END);
render(siteMainElement, new SiteMenuView(filteredMovies), RenderPosition.BEFORE_BEGIN);

moviesBoardPresenter.init(movies, commentsList);
