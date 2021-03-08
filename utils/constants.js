exports.DEFAULT_UPDATE_PARAMS = {
  new: true,
  runValidators: true,
  upsert: true,
  omitUndefined: true,
};

exports.errorMessages = {
  WRONG_URL: 'Некорректная ссылка!',
  WRONG_EMAIL: 'Некорректный email',
  WRONG_EMAIL_OR_PASSWORD: 'Неправильная почта или пароль',
  MOVIES_NOT_FOUND: 'Фильмы не найдены',
  USER_NOT_FOUND: 'Пользователь не найден',
  PAGE_NOT_FOUND: 'Страница не найдена',
  WRONG_INPUT_DATA: 'Переданы некорректные данные',
  WRONG_MOVIE_ID: 'Передан некорректный ID фильма',
  UNAUTHORIZED: 'Необходима авторизация',
  FORBIDDEN: 'Нет прав на удаление фильма',
  EXISTING_USER_EMAIL: 'Пользователь с такой почтой уже существует',
};

exports.messages = {
  MOVIE_DELETED: 'Фильм успешно удален',
  LOGOUT: 'Осуществлен выход из аккаунта',
  SERVER_ERROR: 'На сервере произошла ошибка',
};
