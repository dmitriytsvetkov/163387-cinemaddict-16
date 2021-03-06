import {getFormattedMovieDuration, getFormattedMovieYear, trimDescription} from '../../utils/movie-utils';
import {CARD_BUTTON_ACTIVE_CLASS_NAME, MAX_SHORT_DESCRIPTION_LENGTH} from '../../constants';

const createMovieCardTemplate = (movie) => {
  const {
    title,
    rating,
    poster,
    description,
    genres,
    releaseDate,
    duration,
    comments,
    isFavorite,
    isWatched,
    isInWatchlist,
  } = movie;

  const releaseYear = getFormattedMovieYear(releaseDate);
  const formattedDuration = getFormattedMovieDuration(duration);

  const favoriteClassName = isFavorite ? CARD_BUTTON_ACTIVE_CLASS_NAME : '';
  const alreadyWatchedClassName = isWatched ? CARD_BUTTON_ACTIVE_CLASS_NAME : '';
  const inWatchListClassName = isInWatchlist ? CARD_BUTTON_ACTIVE_CLASS_NAME : '';

  const trimmedDescription = trimDescription(description, MAX_SHORT_DESCRIPTION_LENGTH);

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${formattedDuration}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${trimmedDescription ?? description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${inWatchListClassName}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatchedClassName}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export {createMovieCardTemplate};
