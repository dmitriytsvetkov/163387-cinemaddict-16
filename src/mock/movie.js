import dayjs from 'dayjs';
import {getRandomArray, getRandomArrayElement, getRandomInteger, getRandomFloat} from '../utils';

const comments = [
  {
    id: 1,
    text: 'Interesting setting and a good cast',
    date: '2019/12/31 23:59',
    author: 'Tim Macoveev',
    emoji: 'smile.png'
  },
  {
    id: 5,
    text: 'Super film',
    date: '2019/12/31 23:59',
    author: 'John Doe',
    emoji: 'angry.png'
  }
];

const generateComments = () => [[comments[0].id], [comments[1].id]];

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

const generateDuration = () => {
  const hours = getRandomInteger(1, 2);
  const minutes = getRandomInteger(0, 59);

  return `${hours}h ${minutes}m`;
};

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
  comments: generateComments()
});

export {generateMovie};
