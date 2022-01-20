import {render, RenderPosition} from './utils/render';
import UserRankView from './view/user-rank-view';
import {generateMovie, generateComment} from './mock/movie';
import MoviesBoardPresenter from './presenter/movies-board-presenter';
import MoviesModel from './model/movies-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import CommentsModel from './model/comments-model';

const MOVIE_COUNT = 11;

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');

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

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFORE_END);

moviesBoardPresenter.init(commentsList);

const handleSiteMenuClick = () => {
  moviesBoardPresenter.destroy();
};

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel, handleSiteMenuClick);

filterPresenter.init();
