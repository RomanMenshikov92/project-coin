import { messages } from "../data/vars.js";

/**
 * Асинхронная функция для получения счетов пользователя.
 *
 * Эта функция отправляет запрос к API для получения списка счетов,
 * принадлежащих пользователю. В случае успешного ответа возвращает массив
 * объектов счетов, в противном случае возвращает объект с сообщением об ошибке.
 *
 * @export
 * @async
 * @function getScores
 * @param {string} token - Токен авторизации для доступа к API.
 * @returns {Promise<{ payload: Array<Object> }|{ error: string }|null>} -
 * Возвращает объект, содержащий:
 *   - payload (Array<Object>): Массив объектов, представляющих счета пользователя, если операция была успешной.
 *   - error (string): Сообщение об ошибке, если операция не была успешной.
 * @throws {Error} - Генерирует ошибку в случае проблем с сетью или другими непредвиденными ошибками.
 */
export async function getScores(token) {
  try {
    const response = await fetch(`${process.env.API_URL_ACCOUNTS}`, {
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
        console.error(messages.scoreAccountAPIError + ": " + data.error);
        return { error: data.error };
      } else {
        console.log(`${messages.scoreAccountSuccess}`);
        return { payload: data.payload };
      }
    } else {
      console.error(messages.scoreAccountFetchError + ": " + response.status);
      return { error: `${messages.scoreAccountFetchError}: ${response.status}` };
    }
  } catch (error) {
    console.error(messages.apiError + ": ", error);
    throw error;
  }
}

/**
 * Асинхронная функция для получения счета по идентификатору.
 *
 * Эта функция отправляет запрос к API для получения информации о счете
 * по его уникальному идентификатору. В случае успешного ответа возвращает
 * объект счета, в противном случае возвращает объект с сообщением об ошибке.
 *
 * @export
 * @async
 * @function getScoresById
 * @param {string} token - Токен авторизации для доступа к API.
 * @param {string} id - Уникальный идентификатор счета.
 * @returns {Promise<{ payload: Object }|{ error: string }|null>} -
 * Возвращает объект, содержащий:
 *   - payload (Object): Объект, представляющий счет, если операция была успешной.
 *   - error (string): Сообщение об ошибке, если операция не была успешной.
 * @throws {Error} - Генерирует ошибку в случае проблем с сетью или другими непредвиденными ошибками.
 */
export async function getScoresById(token, id) {
  try {
    const response = await fetch(`${process.env.API_URL_ACCOUNTS_ID}${id}`, {
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
        console.error(messages.scoreAccountItemAPIError + ": " + data.error);
        return { error: data.error };
      } else {
        console.log(`${messages.scoreAccountItemSuccess}`);
        return { payload: data.payload };
      }
    } else {
      console.error(messages.scoreAccountItemFetchError + ": " + response.status);
      return { error: `${messages.scoreAccountItemFetchError}: ${response.status}` };
    }
  } catch (error) {
    console.error(messages.apiError + ": ", error);
    throw error;
  }
}

/**
 * Асинхронная функция для создания нового счета.
 *
 * Эта функция отправляет запрос к API для создания нового счета.
 * В случае успешного ответа возвращает информацию о созданном счете,
 * в противном случае возвращает объект с сообщением об ошибке.
 *
 * @export
 * @async
 * @function postScoresAccount
 * @param {string} token - Токен авторизации для доступа к API.
 * @returns {Promise<{ payload: Object }|{ error: string }|null>} -
 * Возвращает объект, содержащий:
 *   - payload (Object): Информация о созданном счете, если операция была успешной.
 *   - error (string): Сообщение об ошибке, если операция не была успешной.
 * @throws {Error} - Генерирует ошибку в случае проблем с сетью или другими непредвиденными ошибками.
 */
export async function postScoresAccount(token) {
  try {
    const response = await fetch(`${process.env.API_URL_CREATE_ACCOUNTS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
      },
    });
    if (response.ok) {
      console.log(`${messages.apiServerSuccess}`);
      const data = await response.json();
      if (data.error) {
        console.error(messages.scoreNewAccountAPIError + ": " + data.error);
        return { error: data.error };
      } else {
        console.log(`${messages.scoreNewAccountSuccess}`);
        return { payload: data.payload };
      }
    } else {
      console.error(`${messages.scoreNewAccountFetchError}: ${response.status}`);
      return { error: `${messages.scoreNewAccountFetchError}: ${response.status}` };
    }
  } catch (error) {
    console.error(messages.apiServerError + ": ", error);
    throw error;
  }
}

/**
 * Асинхронная функция для перевода средств между счетами.
 *
 * Эта функция отправляет запрос к API для выполнения операции перевода средств
 * с одного счета на другой. В случае успешного ответа возвращает информацию
 * о выполненной операции, в противном случае возвращает объект с сообщением об ошибке.
 *
 * @export
 * @async
 * @function postScores
 * @param {string} token - Токен авторизации для доступа к API.
 * @param {string} from - Код счета, с которого пользователь хочет перевести средства.
 * @param {string} to - Код счета, на который пользователь хочет перевести средства.
 * @param {number} amount - Сумма средств, которую пользователь хочет перевести.
 * @returns {Promise<{ payload: Object }|{ error: string }|null>} -
 * Возвращает объект, содержащий:
 *   - payload (Object): Информация о выполненной операции, если операция была успешной.
 *   - error (string): Сообщение об ошибке, если операция не была успешной.
 * @throws {Error} - Генерирует ошибку в случае проблем с сетью или другими непредвиденными ошибками.
 */
export async function postScores(token, from, to, amount) {
  try {
    const response = await fetch(`${process.env.API_URL_TRANSFER_FUNDS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify({ from, to, amount }),
    });
    if (response.ok) {
      console.log(`${messages.apiServerSuccess}`);
      const data = await response.json();
      if (data.error) {
        console.error(messages.scoreAccountItemTransferAPIError + ": " + data.error);
        return { error: data.error };
      } else {
        console.log(`${messages.scoreAccountItemTransferSuccess}`);
        return { payload: data.payload };
      }
    } else {
      console.error(`${messages.scoreAccountItemTransferFetchError}: ${response.status}`);
      return { error: `${messages.scoreAccountItemTransferFetchError}: ${response.status}` };
    }
  } catch (error) {
    console.error(messages.apiServerError + ": ", error);
    throw error;
  }
}
