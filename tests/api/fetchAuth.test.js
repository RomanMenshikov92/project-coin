import { messages } from "../../src/js/data/vars.js";
import { postAuthLogin } from "../../src/js/api/fetchAuth.js";

/**
 * Тесты для функции postAuthLogin.
 * @module postAuthLoginTests
 */
describe("postAuthLogin", () => {
  let logSpy;
  let errorSpy;
  let mockFetch;

  /**
   * Настройка окружения перед всеми тестами.
   * Устанавливает URL для API входа.
   */
  beforeAll(() => {
    process.env.API_URL_LOGIN = "http://localhost:3000/login/";
  });

  /**
   * Настройка окружения перед каждым тестом.
   * Создает моки для функции fetch и шпионов для логирования.
   */
  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  /**
   * Очистка после каждого теста.
   * Восстанавливает шпионов и очищает все моки.
   */
  afterEach(() => {
    jest.clearAllMocks();
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  const mockToken = "mockToken";

  const mockSuccessResponse = {
    ok: true,
    json: () => Promise.resolve({ payload: { token: mockToken } }),
  };

  const mockErrorResponse = {
    ok: false,
    status: 401,
    json: () => Promise.resolve({ error: "Ошибка при получении данных о логине: 401" }),
  };

  /**
   * Тест на успешный вход пользователя.
   * Проверяет, что функция возвращает токен при успешном ответе от сервера.
   */
  it("Возвращаем токен при успешном входе", async () => {
    mockFetch.mockImplementationOnce(() => Promise.resolve(mockSuccessResponse));
    const result = await postAuthLogin("testUser", "testPassword");
    expect(result).toEqual({ payload: mockToken });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(process.env.API_URL_LOGIN, expect.any(Object));
    expect(logSpy).toHaveBeenCalledWith(messages.apiSuccess);
    expect(logSpy).toHaveBeenCalledWith(messages.authLoginSuccess);
  });

  /**
   * Тест на неудачный вход пользователя.
   * Проверяет, что функция возвращает сообщение об ошибке при неудачном ответе от сервера.
   */
  it("Возвращаем сообщение об ошибке при неудачном входе", async () => {
    mockFetch.mockImplementationOnce(() => Promise.resolve(mockErrorResponse));
    const result = await postAuthLogin("testUser", "testPassword");
    expect(result).toEqual({ error: "Ошибка при получении данных о логине: 401" });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(process.env.API_URL_LOGIN, expect.any(Object));
    expect(errorSpy).toHaveBeenCalledWith(`${messages.authLoginFetchError}: ` + `${mockErrorResponse.status}`);
  });

  /**
   * Тест на обработку сетевой ошибки.
   * Проверяет, что функция выбрасывает ошибку при сетевой проблеме.
   */
  it("Выбрасываем ошибку при сетевой ошибке", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network Error"));
    await expect(postAuthLogin("testUser", "testPassword")).rejects.toThrow("Network Error");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(process.env.API_URL_LOGIN, expect.any(Object));
    expect(errorSpy).toHaveBeenCalledWith(messages.apiError + ": ", new Error("Network Error"));
  });
});
