import { messages } from "../data/vars.js";

/**
 * Асинхронная функция для получения списка банкоматов из сервера
 *
 * Эта функция отправляет запрос к API для получения данных о банкоматах.
 * В случае успешного ответа возвращает массив объектов банкоматов,
 * в противном случае возвращает объект с сообщением об ошибке.
 *
 * @export
 * @async
 * @function getBankATMs
 * @param {string} token - Токен авторизации для доступа к API.
 * @returns {Promise<{ payload: Array<Object> }|{ error: string }|null>} -
 * Возвращает объект, содержащий:
 *   - payload (Array<Object>): Массив объектов, представляющих банкоматы, если операция была успешной.
 *   - error (string): Сообщение об ошибке, если операция не была успешной.
 * @throws {Error} - Генерирует ошибку в случае проблем с сетью или другими непредвиденными ошибками.
 */
export async function getBankATMs(token) {
  try {
    const response = await fetch(process.env.API_URL_BANKS, {
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
        console.error(messages.bankATMsAPIError + ": " + data.error);
        return { error: data.error };
      } else {
        console.log(`${messages.bankATMsSuccess}`);
        return { payload: data.payload };
      }
    } else {
      console.error(messages.bankATMsFetchError + ": " + response.status);
      return { error: `${messages.bankATMsFetchError}: ${response.status}` };
    }
  } catch (error) {
    console.error(messages.apiError + ": ", error);
    throw error;
  }
}
