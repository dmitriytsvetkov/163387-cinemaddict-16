import dayjs from 'dayjs';
import {
  getRandomArray,
  getRandomArrayElement,
  getRandomFloat,
  getRandomInteger,
  getRandomUniqueArray
} from '../utils/common';
import {nanoid} from 'nanoid';

const generateRandomCommentsIds = () => getRandomUniqueArray(10, getRandomInteger(0, 5));

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  ];

  return getRandomArrayElement(descriptions);
};

const generatePosters = () => {
  const posters = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];

  return getRandomArrayElement(posters);
};

const generateTitle = () => {
  const titles = [
    'Made for Each Other',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'Sagebrush Trail',
    'Santa Claus Conquers the Martians',
    'The Dance of Life',
    'The Great Flamarion',
    'The Man with the Golden Arm',
  ];

  return getRandomArrayElement(titles);
};

const generateGenres = () => {
  const genres = [
    'Drama',
    'Film-Noir',
    'Mystery',
    'Thriller',
  ];

  return getRandomArray(genres, getRandomInteger(0, genres.length - 1));
};

const generateCountry = () => {
  const countries = [
    'USA',
    'Russia',
    'Italy',
    'Mexico',
    'Spain',
  ];

  return getRandomArrayElement(countries);
};

const generateRating = () => getRandomFloat(1, 10, 1);

const generateDate = () => {
  const randomYear = getRandomInteger(100, 11);

  return dayjs().subtract(randomYear, 'year').toDate();
};

const generateDuration = () => getRandomInteger(30, 180);

const generateDirector = () => {
  const directors = [
    'Quentin Tarantino',
    'Steven Spielberg',
    'Joon-ho Bong',
    'Guy Ritchie',
    'Wes Anderson',
  ];

  return getRandomArrayElement(directors);
};

const generateWriters = () => {
  const writers = [
    'Billy Wilder',
    'The Coen brothers',
    'Robert Towne',
    'Quentin Tarantino',
    'Francis Ford Coppola',
  ];

  return getRandomArray(writers, getRandomInteger(0, writers.length - 1));
};

const generateAgeRating = () => getRandomInteger(0, 18);

const generateActors = () => {
  const actors = [
    'Jack Nicholson',
    'Marlon Brando',
    'Robert De Niro',
    'Al Pacino',
    'Daniel Day-Lewis',
  ];

  return getRandomArray(actors, getRandomInteger(0, actors.length - 1));
};

const generateMovie = () => ({
  id: nanoid(),
  poster: generatePosters(),
  title: generateTitle(),
  alternativeTitle: generateTitle(),
  rating: generateRating(),
  director: generateDirector(),
  writers: generateWriters(),
  actors: generateActors(),
  releaseDate: generateDate(),
  releaseCountry: generateCountry(),
  duration: generateDuration(),
  genres: generateGenres(),
  description: generateDescription(),
  ageRating: generateAgeRating(),
  comments: generateRandomCommentsIds(),
  isInWatchlist: Boolean(getRandomInteger()),
  isFavorite: Boolean(getRandomInteger()),
  isWatched: Boolean(getRandomInteger()),
  watchedDate: '2022-01-12T16:12:32.554Z',
});

const generateCommentText = () => {
  const comments = [
    'Interesting setting and a good cast',
    'Booooooooooring',
    'Very very old. Meh',
    'Almost two hours? Seriously?',
    'WTF?',
    'Where is my money?',
    'QWERTYASD?',
    'Wes Anderson',
    'Joon-ho Bong',
    'The Coen brothers',
    'Robert Towne',
  ];

  return getRandomArrayElement(comments);
};

const generateAuthorName = () => {
  const names = [
    'Michael Jackson',
    'John Doe',
    'Jack Black',
    'Ace Ventura',
  ];

  return getRandomArrayElement(names);
};

const generateEmoji = () => {
  const emojiList = [
    'smile',
    'sleeping',
    'puke',
    'angry',
  ];

  return getRandomArrayElement(emojiList);
};

const generateComment = (id) => ({
  id: `${id}`,
  text: generateCommentText(),
  date: generateDate(),
  author: generateAuthorName(),
  emoji: generateEmoji(),
});

export {generateMovie, generateComment};
