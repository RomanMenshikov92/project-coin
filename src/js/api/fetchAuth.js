import { messages } from "../data/vars.js";

/**
 * Асинхронная функция для авторизации пользователя.
 *
 * Эта функция отправляет запрос к API для получения токена авторизации
 * на основе предоставленных логина и пароля. В случае успешного ответа
 * возвращает токен, в противном случае возвращает объект с сообщением об ошибке.
 *
 * @export
 * @async
 * @function postAuthLogin
 * @param {string} login - Логин пользователя для авторизации.
 * @param {string} password - Пароль пользователя для авторизации.
 * @returns {Promise<{ payload: string }|{ error: string }|null>} -
 * Возвращает объект, содержащий:
 *   - payload (string): Токен авторизации, если операция была успешной.
 *   - error (string): Сообщение об ошибке, если операция не была успешной.
 * @throws {Error} - Генерирует ошибку в случае проблем с сетью или другими непредвиденными ошибками.
 */
export async function postAuthLogin(login, password) {
  try {
    const response = await fetch(`${process.env.API_URL_LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });
    if (response.ok) {
      console.log(`${messages.apiSuccess}`);
      const data = await response.json();
      if (data.error) {
        console.error(messages.authLoginAPIError + ": " + data.error);
        return { error: data.error };
      } else {
        console.log(`${messages.authLoginSuccess}`);
        return { payload: data.payload.token };
      }
    } else {
      console.error(messages.authLoginFetchError + ": " + response.status);
      return { error: `${messages.authLoginFetchError}: ${response.status}` };
    }
  } catch (error) {
    console.error(messages.apiError + ": ", error);
    throw error;
  }
}
