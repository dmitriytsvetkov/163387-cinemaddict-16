import {render, RenderPosition, remove} from './utils/render';
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
import NoMoviesView from './view/no-movies-view';

const MOVIE_COUNT = 11;
const MOVIE_COUNT_PER_STEP = 5;

const siteBodyElement = document.querySelector('body');
const siteMainElement = siteBodyElement.querySelector('.main');
const siteHeaderElement = siteBodyElement.querySelector('.header');
const siteFooterElement = siteBodyElement.querySelector('.footer');
const movieListContainer = siteMainElement.querySelector('.films-list');
const movieListExtraElements = siteMainElement.querySelectorAll('.films-list--extra');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const movies = Array.from({length: MOVIE_COUNT}, generateMovie);

const filteredMovies = generateMoviesFilter(movies);

const commentsList = [];
movies.map((movie, index) => {
  commentsList.push(generateComment(index));

});

const renderMovie = (container, movie) => {
  const movieComponent = new MovieCardView(movie);
  const moviePopupComponent = new MoviePopupView(movie);

  const showPopup = () => {
    render(siteFooterElement, moviePopupComponent, RenderPosition.AFTER_END);
    const filmDetailsBottomContainerElement = document.querySelector('.film-details__bottom-container');
    render(filmDetailsBottomContainerElement, new MovieCommentsView(movie, commentsList), RenderPosition.BEFORE_END);
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

  movieComponent.setEditClickHandler(() => {
    siteBodyElement.classList.add('hide-overflow');
    showPopup();
    document.addEventListener('keydown', onEscKeyKeyDown);
  });

  moviePopupComponent.setClosePopupClickHandler(() => {
    hidePopup();
    document.removeEventListener('keydown', onEscKeyKeyDown);
  });

  render(container, movieComponent, RenderPosition.BEFORE_END);
};

const renderMoviesBoard = () => {
  const movieListComponent = new MovieListView();

  if (!movies.length) {
    render(movieListContainer, new NoMoviesView(), RenderPosition.BEFORE_END);
  } else {
    render(movieListContainer, movieListComponent, RenderPosition.BEFORE_END);

    for (let i = 0; i < Math.min(movies.length, MOVIE_COUNT_PER_STEP); i++) {
      renderMovie(movieListComponent, movies[i]);
    }

    movieListExtraElements.forEach((element, index) => {
      const container = element.querySelector('.films-list__container');
      renderMovie(container, movies[index]);
    });

    if (movies.length > MOVIE_COUNT_PER_STEP) {
      const loadMoreButtonComponent = new LoadMoreButtonView();
      render(movieListContainer, loadMoreButtonComponent, RenderPosition.BEFORE_END);

      let renderedMoviesCount = MOVIE_COUNT_PER_STEP;


      loadMoreButtonComponent.setLoadMoreClickHandler(() => {
        movies.slice(renderedMoviesCount, renderedMoviesCount + MOVIE_COUNT_PER_STEP)
          .forEach((movie) => {
            renderMovie(movieListComponent, movie);
          });

        renderedMoviesCount += MOVIE_COUNT_PER_STEP;

        if (renderedMoviesCount >= movies.length) {
          remove(loadMoreButtonComponent);
        }
      });
    }
  }
};

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFORE_END);
render(siteMainElement, new SiteMenuView(filteredMovies), RenderPosition.AFTER_BEGIN);

renderMoviesBoard();

render(footerStatisticsElement, new MoviesCountView(movies.length), RenderPosition.AFTER_END);
