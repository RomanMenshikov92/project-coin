/**
 * Сообщения для API-функции
 *
 * @typedef {Object} Messages
 * @type {Messages}
 * @property {string} apiSuccess - Сообщение об успешном получении данных от API
 * @property {string} apiError - Сообщение об ошибке при взаимодействии с API
 * @property {string} apiWebSocketOpen - Сообщение об успешном установлении соединения с сокетом
 * @property {string} apiWebSocketClose - Сообщение о закрытии соединения сокета
 * @property {string} apiWebSocketEventError - Сообщение об ошибке обработки сообщений
 * @property {string} apiWebSocketError - Сообщение об ошибке сокета
 * @property {string} apiServerSuccess - Сообщение об успешной отправке данных на сервер
 * @property {string} apiServerError - Сообщение об ошибке на сервере при взаимодействии с API
 * @property {string} bankATMsSuccess - Сообщение об успешном получении данных о банкоматах
 * @property {string} bankATMsFetchError - Сообщение об ошибке при получении данных о банкоматах
 * @property {string} bankATMsAPIError - Сообщение об ошибке от API при запросе данных о банкоматах
 * @property {string} mapErrorInitializing - Сообщение об ошибке при инициализации карты
 * @property {string} mapErrorInitializationFailed - Сообщение о неудачной инициализации карты
 * @property {string} mapErrorLoading - Сообщение об ошибке при загрузке карты
 * @property {string} mapErrorCommon - Сообщение о невозможности загрузки карты
 * @property {string} authLoginSuccess - Сообщение об успешной авторизации пользователя
 * @property {string} authLoginFetchError - Сообщение об ошибке при получении данных о логине
 * @property {string} authLoginAPIError - Сообщение об ошибке от API при запросе данных о логине
 * @property {string} scoreAccountSuccess - Сообщение об успешном получении данных о счетах
 * @property {string} scoreAccountFetchError - Сообщение об ошибке при получении данных о счетах
 * @property {string} scoreAccountAPIError - Сообщение об ошибке от API при запросе данных о счетах
 * @property {string} scoreNewAccountSuccess - Сообщение об успешной отправке данных о новом счете
 * @property {string} scoreNewAccountFetchError - Сообщение об ошибке при отправке данных о новом счете
 * @property {string} scoreNewAccountAPIError - Сообщение об ошибке от API при запросе данных о новом счете
 * @property {string} scoreAccountItemSuccess - Сообщение об успешном получении данных о текущем счете
 * @property {string} scoreAccountItemFetchError - Сообщение об ошибке при получении данных о текущем счете
 * @property {string} scoreAccountItemAPIError - Сообщение об ошибке от API при запросе данных о текущем счете
 * @property {string} scoreAccountItemTransferSuccess - Сообщение об успешной отправке данных на тот номер
 * @property {string} scoreAccountItemTransferFetchError - Сообщение об ошибке при отправке данных на тот номер
 * @property {string} scoreAccountItemTransferAPIError - Сообщение об ошибке от API при отправке данных на тот номер
 * @property {string} allCurrenciesSuccess - Сообщение об успешном получении данных о всех валютах
 * @property {string} allCurrenciesFetchError - Сообщение об ошибке при получении данных о всех валютах
 * @property {string} allCurrenciesAPIError - Сообщение об ошибке от API при запросе данных о всех валютах
 * @property {string} yoursCurrenciesSuccess - Сообщение об успешном получении данных о ваших валютах
 * @property {string} yoursCurrenciesFetchError - Сообщение об ошибке при получении данных о ваших валютах
 * @property {string} yoursCurrenciesAPIError - Сообщение об ошибке от API при запросе данных о ваших валютах
 * @property {string} currencyBuySuccess - Сообщение об успешной отправке данных о вашем обмене валюты
 * @property {string} currencyBuyFetchError - Сообщение об ошибке при отправке данных о вашем обмене валют
 * @property {string} currencyBuyAPIError - Сообщение об ошибке от API при отправке данных о вашем обмене валют
 * @property {string} notToken - Сообщение об отсутствии токена
 */
export const messages = {
  apiSuccess: "Успешно получено данные от API",
  apiError: "Ошибка при взаимодействии с API",
  apiWebSocketOpen: "Установлено соединение с сокетом",
  apiWebSocketClose: "Соединение сокета закрыто",
  apiWebSocketEventError: "Ошибка обработки сообщений",
  apiWebSocketError: "Ошибка сокета",
  apiServerSuccess: "Успешно отправлены данные от API",
  apiServerError: "Ошибка на сервере при взаимодействии с API",
  bankATMsSuccess: "Данные о банкоматах успешно получены",
  bankATMsFetchError: "Ошибка при получении данных о банкоматах",
  bankATMsAPIError: "Ошибка от API при запросе данных о банкоматах",
  mapErrorInitializing: "Ошибка при инициализации карты",
  mapErrorInitializationFailed: "Не удалось инициализировать карту",
  mapErrorLoading: "Ошибка при загрузке карты",
  mapErrorCommon: "Не удалось загрузить карту. Попробуйте обновить страницу",
  authLoginSuccess: "Пользователь авторизован. Данные о логине успешно получены",
  authLoginFetchError: "Ошибка при получении данных о логине",
  authLoginAPIError: "Ошибка от API при запросе данных о логине",
  scoreAccountSuccess: "Пользователь авторизован. Данные о счетах успешно получены",
  scoreAccountFetchError: "Ошибка при получении данных о счетах",
  scoreAccountAPIError: "Ошибка от API при запросе данных о счетах",
  scoreNewAccountSuccess: "Пользователь авторизован. Данные о новом счете успешно отправлены",
  scoreNewAccountFetchError: "Ошибка при отправлении данных о новом счете",
  scoreNewAccountAPIError: "Ошибка от API при запросе данных о новом счете",
  scoreAccountItemSuccess: "Пользователь авторизован. Данные о текущем счете успешно получены",
  scoreAccountItemFetchError: "Ошибка при получении данных о текущем счете",
  scoreAccountItemAPIError: "Ошибка от API при запросе данных о текущем счете",
  scoreAccountItemTransferSuccess: "Пользователь авторизован. Данные на тот номер успешно отправлены",
  scoreAccountItemTransferFetchError: "Ошибка при отправлении данных на тот номер",
  scoreAccountItemTransferAPIError: "Ошибка от API при отправлении данных на тот номер",
  allCurrenciesSuccess: "Пользователь авторизован. Данные о всех валютах успешно получены",
  allCurrenciesFetchError: "Ошибка при получении данных о всех валютах",
  allCurrenciesAPIError: "Ошибка от API при запросе данных о всех валютах",
  yoursCurrenciesSuccess: "Пользователь авторизован. Данные о ваших валютах успешно получены",
  yoursCurrenciesFetchError: "Ошибка при получении данных о ваших валютах",
  yoursCurrenciesAPIError: "Ошибка от API при запросе данных о ваших валютах",
  currencyBuySuccess: "Пользователь авторизован. Данные о вашем обмене валюты успешно отправлены",
  currencyBuyFetchError: "Ошибка при отправлении данных о вашем обмене валют",
  currencyBuyAPIError: "Ошибка от API при отправлении данных о вашем обмене валют",
  notToken: "Токен отсутствует",
};
