import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import {filter} from './filter';
import {FilterType} from '../constants';
import {makeItemsUniq} from './common';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);

const getFormattedMovieDate = (date, formatString) => dayjs(date).format(formatString);

const getFormattedMovieYear = (date) => getFormattedMovieDate(date, 'YYYY');

const getFormattedMovieDuration = (minutes) => dayjs.duration(minutes, 'm').format('H[h] m[m]');

const getRelativeTime = (date) => dayjs(date).fromNow();

const sortByYear = (movieA, movieB) => {
  const yearA = getFormattedMovieYear(movieA.releaseDate);
  const yearB = getFormattedMovieYear(movieB.releaseDate);

  return yearB - yearA;
};

const isGenresMultiple = (array) => array.length > 1;

const trimDescription = (description, maxDescriptionLength) => {
  let result = null;
  if (description.length > maxDescriptionLength) {
    result = description.substr(0, 139);
    result = `${result}...`;
  }
  return result;
};

const sortByRating = (movieA, movieB) => movieB.rating - movieA.rating;

const getChartData = (moviesData, dateFrom, dateTo) => {
  const filteredMovies = filter[FilterType.HISTORY](moviesData);
  const moviesInRange = (dateFrom && dateTo) ?
    filteredMovies.filter((card) => dayjs(card.watchedDate).isBetween(dateFrom, dateTo)) :
    filteredMovies;

  const genres = moviesInRange.map((card) => [...card.genres]).flat();
  const uniqGenres = makeItemsUniq(genres);

  const genresData = uniqGenres.map((uniqGenre) => ({
    genre: uniqGenre,
    count: genres.filter((genre) => genre === uniqGenre).length,
  }));

  const moviesByGenreCount = genresData.map((item) => item.count);

  return {
    moviesInRange,
    uniqGenres,
    moviesByGenreCount,
    genresData,
    watchedMoviesCount: filteredMovies.length,
  };
};

const renderChart = (ctx, cardsData, dateFrom, dateTo) => {
  const BAR_HEIGHT = 50;
  const {uniqGenres, moviesByGenreCount} = getChartData(cardsData, dateFrom, dateTo);

  ctx.height = BAR_HEIGHT * uniqGenres.length;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqGenres,
      datasets: [{
        data: moviesByGenreCount,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export {getFormattedMovieDate, getFormattedMovieDuration, getRelativeTime, sortByYear, getFormattedMovieYear, sortByRating, isGenresMultiple, trimDescription, renderChart, getChartData};
