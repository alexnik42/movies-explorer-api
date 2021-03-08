const Movie = require('../models/movie');
const { errorMessages } = require('../utils/constants');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');

exports.getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError(errorMessages.MOVIES_NOT_FOUND);
      }
      res.send(movies);
    })
    .catch((err) => next(err));
};

exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
  })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError(errorMessages.WRONG_INPUT_DATA);
      }
      const currentMovie = movie.toObject();
      delete currentMovie.owner;
      res.send(currentMovie);
    })
    .catch((err) => next(err));
};

exports.deleteMovie = (req, res, next) => {
  Movie.findOne(
    {
      movieId: req.params.movieId,
      owner: req.user._id,
    },
  )
    .select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError(errorMessages.WRONG_MOVIE_ID);
      }
      const deletedMovie = movie;
      movie.remove();
      res.send(deletedMovie);
    })
    .catch((err) => next(err));
};
