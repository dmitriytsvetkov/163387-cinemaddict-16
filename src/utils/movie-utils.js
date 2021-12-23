import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const getFormattedMovieDate = (date, formatString) => dayjs(date).format(formatString);

const getFormattedMovieDuration = (minutes) => dayjs.duration(minutes, 'm').format('H[h] m[m]');

const getRelativeTime = (date) => dayjs(date).fromNow();

export {getFormattedMovieDate, getFormattedMovieDuration, getRelativeTime};
