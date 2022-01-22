import {remove, render, RenderPosition} from './utils/render';
import UserRankView from './view/user-rank-view';
import {generateMovie, generateComment} from './mock/movie';
import MoviesBoardPresenter from './presenter/movies-board-presenter';
import MoviesModel from './model/movies-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import CommentsModel from './model/comments-model';
import {MenuItem} from './constants';
import StatisticView from './view/statistic-view';
import StatsTriggerView from './view/stats-trigger-view';
import SiteMenuView from './view/site-menu-view';

const MOVIE_COUNT = 11;

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');

const statsTriggerComponent = new StatsTriggerView();

const siteMenuComponent = new SiteMenuView();

const movies = Array.from({length: MOVIE_COUNT}, generateMovie);
const moviesModel = new MoviesModel();

moviesModel.movies = movies;

const filterModel = new FilterModel();

const commentsList = [];
movies.map((movie, index) => {
  commentsList.push(generateComment(index));
});

const commentsModel = new CommentsModel();
commentsModel.comments = commentsList;

const moviesBoardPresenter = new MoviesBoardPresenter(siteMainElement, moviesModel, filterModel, commentsModel);

const filterPresenter = new FilterPresenter(siteMenuComponent, filterModel, moviesModel);

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFORE_END);
render(siteMainElement, siteMenuComponent, RenderPosition.BEFORE_END);
render(siteMenuComponent, statsTriggerComponent, RenderPosition.BEFORE_END);

moviesBoardPresenter.init(commentsList);

filterPresenter.init();
let statisticComponent = null;
const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      remove(statisticComponent);
      moviesBoardPresenter.init();
      filterPresenter.init();
      break;
    case MenuItem.STATS:
      moviesBoardPresenter.destroy();
      filterPresenter.destroy();
      statisticComponent = new StatisticView(moviesModel.movies);
      render(siteMainElement, statisticComponent, RenderPosition.BEFORE_END);
      filterPresenter.setMenuClickHandler(handleSiteMenuClick);
      break;
  }
};

statsTriggerComponent.setMenuClickHandler(handleSiteMenuClick);
