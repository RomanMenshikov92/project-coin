import { el } from "redom";
import FormAuth from "../../src/js/components/AuthForm.js";
import { validateLogin, validatePassword } from "../../src/js/functions/validateAuthTest.js";
import { postAuthLogin } from "../../src/js/api/fetchAuth.js";

/**
 * Мокирование зависимостей
 *
 * Мы используем jest.mock для имитации зависимостей нашего приложения.
 * Это позволяет нам изолировать наш код и протестировать его более эффективно.
 */
jest.mock("../../src/js/api/fetchAuth.js");
jest.mock("redom", () => {
  return {
    el: jest.fn(() => ({
      addEventListener: jest.fn(),
      classList: { add: jest.fn(), remove: jest.fn() },
    })),
    mount: jest.fn(),
  };
});

/**
 * Тесты для компонента формы аутентификации.
 * @module FormAuthTests
 */
describe("FormAuth", () => {
  let formAuth;
  let mockRouter;
  let mockAuthPage;
  let logSpy;
  let errorSpy;

  /**
   * Настройка среды тестирования перед каждым тестом.
   * Создает экземпляр формы аутентификации и моки для зависимостей.
   */
  beforeEach(() => {
    mockRouter = { navigate: jest.fn() };
    mockAuthPage = {
      wrapper: el("div"),
      loader: {
        render: jest.fn(),
        remove: jest.fn(),
      },
    };
    formAuth = new FormAuth(mockRouter, mockAuthPage);

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

  /**
   * Тест на создание экземпляра компонента формы аутентификации.
   * Проверяет, что экземпляр создан корректно и содержит необходимые свойства.
   */
  it("Создает экземпляры компонента формы аутентификации", () => {
    expect(formAuth).toBeInstanceOf(FormAuth);
    expect(formAuth.router).toBe(mockRouter);
  });

  /**
   * Тест на рендеринг формы аутентификации.
   * Проверяет, что форма рендерится с правильными элементами.
   */
  it("Рендерит форму аутентификации", () => {
    const container = el("div");
    formAuth.render(container);
    const mockEl = jest.requireMock("redom").el;

    expect(mockEl).toHaveBeenCalledWith("form.modal__form", {
      id: "auth",
      action: "/",
      method: "POST",
      "aria-label": "Форма аутентификации",
      autocomplete: "off",
    });
    expect(mockEl).toHaveBeenCalledWith("label.modal__form-label", { for: "login" });
    expect(mockEl).toHaveBeenCalledWith("label.modal__form-label", { for: "password" });
    expect(mockEl).toHaveBeenCalledWith("span.modal__form-span", "Логин");
    expect(mockEl).toHaveBeenCalledWith("span.modal__form-span", "Пароль");
    expect(mockEl).toHaveBeenCalledWith("input.input-reset.modal__form-input", {
      id: "login",
      type: "text",
      name: "login",
      "aria-label": "Введите логин",
      placeholder: "Placeholder",
      autocomplete: "on",
    });
    expect(mockEl).toHaveBeenCalledWith("input.input-reset.modal__form-input", {
      id: "password",
      type: "password",
      name: "password",
      "aria-label": "Введите пароль",
      placeholder: "Placeholder",
      autocomplete: "on",
    });
    expect(mockEl).toHaveBeenCalledWith(".modal__form-bottom");
    expect(mockEl).toHaveBeenCalledWith("span.modal__form-error");
    expect(mockEl).toHaveBeenCalledWith(
      "button.btn-reset.modal__form-btn",
      { type: "button", "aria-hidden": "false" },
      "Войти"
    );
  });

  /**
   * Тест на монтирование формы в контейнер.
   * Проверяет, что форма монтируется корректно.
   */
  it("Монтирует в контейнер", () => {
    const container = el("div");
    formAuth.render(container);

    const mockMount = jest.requireMock("redom").mount;

    expect(mockMount).toHaveBeenCalledWith(container, formAuth.formAuth);
  });

  /**
   * Тест на проверку валидации логина и пароля.
   * Проверяет, что функция валидации работает корректно для различных входных данных.
   */
  it("Проверка валидации логина и пароля", async () => {
    const login1 = "test-001";
    const login2 = "RomanovIR";
    const login3 = "";
    const login4 = "Roman";
    const password1 = "Qwerty123";
    const password2 = "01011990Romanov";
    const password3 = "";
    const password4 = "qwe";
    expect(validateLogin(login1)).toBe(true);
    expect(validateLogin(login2)).toBe(true);
    expect(validateLogin(login3)).toBe(false);
    expect(validateLogin(login4)).toBe(false);
    expect(validatePassword(password1)).toBe(true);
    expect(validatePassword(password2)).toBe(true);
    expect(validatePassword(password3)).toBe(false);
    expect(validatePassword(password4)).toBe(false);
  });

  /**
   * Тест на обработку ошибки входа в систему (неверный логин).
   * Проверяет, что при неверном логине возвращается соответствующее сообщение об ошибке.
   */
  it("Возвращает ошибку входа в систему (неверный логин)", async () => {
    const login = "wrongUser";
    const password = "wrongPassword";

    postAuthLogin.mockResolvedValueOnce({ error: "No such user" });

    const container = el("div");
    formAuth.render(container);

    formAuth.inputLogin.value = login;
    formAuth.inputPassword.value = password;

    const result = await formAuth.login(0);

    expect(result).toBe(false);
    expect(formAuth.errorSpan.textContent).toBe("Такого пользователя нет");
  });

  /**
   * Тест на обработку ошибки входа в систему (неверный пароль).
   * Проверяет, что при неверном пароле возвращается соответствующее сообщение об ошибке.
   */
  it("Возвращает ошибку входа в систему (неверный пароль)", async () => {
    const login = "testUser";
    const password = "wrongPassword";

    postAuthLogin.mockResolvedValueOnce({ error: "Invalid password" });

    const container = el("div");
    formAuth.render(container);

    formAuth.inputLogin.value = login;
    formAuth.inputPassword.value = password;

    const result = await formAuth.login(0);

    expect(result).toBe(false);
    expect(formAuth.errorSpan.textContent).toBe("Неверный пароль");
  });

  /**
   * Тест на обработку сетевой ошибки при входе в систему.
   * Проверяет, что при сетевой ошибке возвращается соответствующее сообщение об ошибке.
   */
  it("Возвращает сетевую ошибку", async () => {
    const login = "testUser   ";
    const password = "testPassword";

    postAuthLogin.mockRejectedValueOnce(new Error("Network Error"));

    const container = el("div");
    formAuth.render(container);

    formAuth.inputLogin.value = login;
    formAuth.inputPassword.value = password;

    const result = await formAuth.login(0);

    expect(result).toBe(false);
    expect(formAuth.errorSpan.textContent).toBe("Ошибка при авторизации. Пожалуйста, попробуйте еще раз.");
  });
});
