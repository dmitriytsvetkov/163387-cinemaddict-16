const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST'
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get movies() {
    return this.#load({url: 'movies'}).then(ApiService.parseResponse);
  }

  getComments = async (id) => this.#load({url: `comments/${id}`}).then(ApiService.parseResponse)

  #load = async ({url, method = Method.GET, body = null, headers = new Headers()}) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  updateMovie = async (movie) => {
    const response = await this.#load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.adaptMovieToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  deleteComment = async (comment) => await this.#load({
    url: `/comments/${comment}`,
    method: Method.DELETE,
  })

  addComment = async (comment, movie) => {
    const response = await this.#load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  static parseResponse = (response) => response.json()

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}, ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }

  adaptMovieToServer = (movie) => {
    const adaptedMovie = {
      ...movie,
      // eslint-disable-next-line camelcase
      film_info: {
        title: movie.title,
        // eslint-disable-next-line camelcase
        alternative_title: movie.alternativeTitle,
        // eslint-disable-next-line camelcase
        total_rating: movie.rating,
        poster: movie.poster,
        // eslint-disable-next-line camelcase
        age_rating: movie.ageRating,
        director: movie.director,
        writers: movie.writers,
        actors: movie.actors,
        release: {
          date: movie.releaseDate,
          // eslint-disable-next-line camelcase
          release_country: movie.releaseCountry,
        },
        runtime: movie.duration,
        genre: movie.genres,
        description: movie.description,
      },
      // eslint-disable-next-line camelcase
      user_details: {
        watchlist: movie.isInWatchlist,
        // eslint-disable-next-line camelcase
        already_watched: movie.isWatched,
        // eslint-disable-next-line camelcase
        watching_date: movie.watchedDate,
        favorite: movie.isFavorite
      }
    };

    delete adaptedMovie.title;
    delete adaptedMovie.alternativeTitle;
    delete adaptedMovie.rating;
    delete adaptedMovie.poster;
    delete adaptedMovie.ageRating;
    delete adaptedMovie.director;
    delete adaptedMovie.writers;
    delete adaptedMovie.actors;
    delete adaptedMovie.releaseDate;
    delete adaptedMovie.releaseCountry;
    delete adaptedMovie.duration;
    delete adaptedMovie.genres;
    delete adaptedMovie.description;
    delete adaptedMovie.isInWatchlist;
    delete adaptedMovie.isWatched;
    delete adaptedMovie.watchedDate;
    delete adaptedMovie.isFavorite;

    return adaptedMovie;
  }
}
