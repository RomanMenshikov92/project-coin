import { messages } from "../data/vars.js";

/**
 * Асинхронная функция для получения всех валют.
 *
 * Эта функция отправляет запрос к API для получения списка доступных валют.
 * В случае успешного ответа возвращает массив объектов валют,
 * в противном случае возвращает объект с сообщением об ошибке.
 *
 * @export
 * @async
 * @function getAllCurrencies
 * @param {string} token - Токен авторизации для доступа к API.
 * @returns {Promise<{ payload: Array<string> }|{ error: string }|null>} -
 * Возвращает объект, содержащий:
 *   - payload (Array<string>): Массив строк, представляющих валюты, если операция была успешной.
 *   - error (string): Сообщение об ошибке, если операция не была успешной.
 * @throws {Error} - Генерирует ошибку в случае проблем с сетью или другими непредвиденными ошибками.
 */
export async function getAllCurrencies(token) {
  try {
    const response = await fetch(`${process.env.API_URL_ALL_CURRENCIES}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
      },
    });
    if (response.ok) {
      console.log(`${messages.apiSuccess}`);
      const data = await response.json();
      if (data.error) {
        console.error(messages.allCurrenciesAPIError + ": " + data.error);
        return { error: data.error };
      } else {
        console.log(`${messages.allCurrenciesSuccess}`);
        return { payload: data.payload };
      }
    } else {
      console.error(messages.allCurrenciesFetchError + ": " + response.status);
      return { error: `${messages.allCurrenciesFetchError}: ${response.status}` };
    }
  } catch (error) {
    console.error(messages.apiError + ": ", error);
    throw error;
  }
}

/**
 * Асинхронная функция для получения валют пользователя.
 *
 * Эта функция отправляет запрос к API для получения списка валют,
 * принадлежащих пользователю. В случае успешного ответа возвращает массив
 * объектов валют, в противном случае возвращает объект с сообщением об ошибке.
 *
 * @export
 * @async
 * @function getYourCurrencies
 * @param {string} token - Токен авторизации для доступа к API.
 * @returns {Promise<{ payload: Object<Object> }|{ error: string }|null>} -
 * Возвращает объект, содержащий:
 *   - payload (Object<Object>): Объект, который содержит ключи в виде кодов валют, где каждое значение представляет собой объект, содержащий информацию о валюте пользователя, если операция была успешной
 *   - error (string): Сообщение об ошибке, если операция не была успешной.
 * @throws {Error} - Генерирует ошибку в случае проблем с сетью или другими непредвиденными ошибками.
 */
export async function getYourCurrencies(token) {
  try {
    const response = await fetch(`${process.env.API_URL_CURRENCIES}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
      },
    });
    if (response.ok) {
      console.log(`${messages.apiSuccess}`);
      const data = await response.json();
      if (data.error) {
        console.error(messages.yoursCurrenciesAPIError + ": " + data.error);
        return { error: data.error };
      } else {
        console.log(`${messages.yoursCurrenciesSuccess}`);
        return { payload: data.payload };
      }
    } else {
      console.error(messages.yoursCurrenciesFetchError + ": " + response.status);
      return { error: `${messages.yoursCurrenciesFetchError}: ${response.status}` };
    }
  } catch (error) {
    console.error(messages.apiError + ": ", error);
    throw error;
  }
}

/**
 * Асинхронная функция для покупки валюты.
 *
 * Эта функция отправляет запрос к API для выполнения операции покупки валюты.
 * В случае успешного ответа возвращает информацию о выполненной операции,
 * в противном случае возвращает объект с сообщением об ошибке.
 *
 * @export
 * @async
 * @function postCurrencyBuy
 * @param {string} token - Токен авторизации для доступа к API.
 * @param {string} from - Код валюты, которую пользователь хочет продать.
 * @param {string} to - Код валюты, которую пользователь хочет купить.
 * @param {number} amount - Сумма валюты, которую пользователь хочет купить.
 * @returns {Promise<{ payload: Object }|{ error: string }|null>} -
 * Возвращает объект, содержащий:
 *   - payload (Object): Информация о выполненной операции, если операция была успешной.
 *   - error (string): Сообщение об ошибке, если операция не была успешной.
 * @throws {Error} - Генерирует ошибку в случае проблем с сетью или другими непредвиденными ошибками.
 */
export async function postCurrencyBuy(token, from, to, amount) {
  try {
    const response = await fetch(`${process.env.API_URL_CURRENCY_BUY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify({ from, to, amount }),
    });
    if (response.ok) {
      console.log(`${messages.apiSuccess}`);
      const data = await response.json();
      if (data.error) {
        console.error(messages.currencyBuyAPIError + ": " + data.error);
        return { error: data.error };
      } else {
        console.log(`${messages.currencyBuySuccess}`);
        return { payload: data.payload };
      }
    } else {
      console.error(messages.currencyBuyFetchError + ": " + response.status);
      return { error: `${messages.currencyBuyFetchError}: ${response.status}` };
    }
  } catch (error) {
    console.error(messages.apiError + ": ", error);
    throw error;
  }
}

/**
 * Функция для работы с веб-сокетом для получения данных о валютных курсах.
 *
 * Эта функция устанавливает веб-сокет соединение для получения обновлений
 * о курсах валют. Если токен не предоставлен, функция выводит сообщение об ошибке.
 *
 * @export
 * @function websocketCurrencyFeed
 * @param {string} token - Токен авторизации для доступа к API.
 * @param {function} onUpdate - Функция обратного вызова для обработки обновлений курса валют.
 * @param {function} onError - Функция обратного вызова для обработки ошибок веб-сокета.
 * @returns {WebSocket} - Возвращает объект веб-сокета.
 */
export function websocketCurrencyFeed(token, onUpdate, onError) {
  if (!token) {
    console.error(messages.notToken);
    return;
  }

  const socket = new WebSocket(process.env.API_URL_CURRENCY_FEED);

  socket.onopen = () => {
    console.log(messages.apiWebSocketOpen);
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "EXCHANGE_RATE_CHANGE") {
        onUpdate(message.from, message.to, message.rate, message.change);
      }
    } catch (error) {
      console.error(`${messages.apiWebSocketEventError}: ${error}`);
    }
  };

  socket.onclose = (event) => {
    console.log(messages.apiWebSocketClose);
  };

  socket.onerror = (error) => {
    console.error(`${messages.apiWebSocketError}: ${error}`);
    onError(error);
  };

  return socket;
}
