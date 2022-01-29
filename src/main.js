import {remove, render, RenderPosition} from './utils/render';
import MoviesBoardPresenter from './presenter/movies-board-presenter';
import MoviesModel from './model/movies-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import CommentsModel from './model/comments-model';
import {MenuItem} from './constants';
import StatisticView from './view/statistic-view';
import StatsTriggerView from './view/stats-trigger-view';
import SiteMenuView from './view/site-menu-view';
import ApiService from './api-service';
import MoviesCountView from './view/movies-count-view';

const AUTHORIZATION = 'Basic qwertyasdzxc123321';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteFooterElement = siteBodyElement.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const statsTriggerComponent = new StatsTriggerView();

const siteMenuComponent = new SiteMenuView();

const moviesModel = new MoviesModel(apiService);

const filterModel = new FilterModel();

const commentsModel = new CommentsModel(apiService);

const moviesBoardPresenter = new MoviesBoardPresenter(siteMainElement, moviesModel, filterModel, commentsModel);

const filterPresenter = new FilterPresenter(siteMenuComponent, filterModel, moviesModel);

moviesBoardPresenter.init();
filterPresenter.init();

let statisticComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.MOVIES:
      statsTriggerComponent.updateData({active: false});
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
      statsTriggerComponent.updateData({active: true});
      break;
  }
};

moviesModel.init().finally(() => {
  render(siteMainElement, siteMenuComponent, RenderPosition.BEFORE_END);
  render(siteMenuComponent, statsTriggerComponent, RenderPosition.BEFORE_END);
  const moviesCountComponent = new MoviesCountView(moviesModel.movies.length);
  render(footerStatisticsElement, moviesCountComponent, RenderPosition.AFTER_END);
  statsTriggerComponent.setMenuClickHandler(handleSiteMenuClick);
});
