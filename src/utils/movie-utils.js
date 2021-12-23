import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const getFormattedMovieDate = (date, formatString) => dayjs(date).format(formatString);

const getFormattedMovieYear = (date) => getFormattedMovieDate(date, 'YYYY');

const getFormattedMovieDuration = (minutes) => dayjs.duration(minutes, 'm').format('H[h] m[m]');

const getRelativeTime = (date) => dayjs(date).fromNow();

const sortByYear = (movieA, movieB) => {
  const yearA = getFormattedMovieYear(movieA.releaseDate);
  const yearB = getFormattedMovieYear(movieB.releaseDate);

  return yearB - yearA;
};

const sortByRating = (movieA, movieB) => movieB.rating - movieA.rating;

export {getFormattedMovieDate, getFormattedMovieDuration, getRelativeTime, sortByYear, getFormattedMovieYear, sortByRating};
