import { el } from "redom";
import AuthPage from "../../src/js/pages/pageAuth.js";
import FormAuth from "../../src/js/components/AuthForm.js";
import Loader from "../../src/js/components/Loader.js";

/**
 * Мокирование зависимостей
 *
 * Мы используем jest.mock для имитации зависимостей нашего приложения.
 * Это позволяет нам изолировать наш код и протестировать его более эффективно.
 */
jest.mock("../../src/js/components/AuthForm.js");
jest.mock("../../src/js/components/Loader.js");
jest.mock("redom");

/**
 * Тесты для страницы аутентификации.
 * @module AuthPageTests
 */
describe("AuthPage", () => {
  let authPage;
  let mockRouter;
  let mockWrapper;

  /**
   * Настройка среды тестирования перед каждым тестом.
   * Создает новый экземпляр страницы аутентификации и моки для зависимостей.
   */
  beforeEach(() => {
    mockRouter = { navigate: jest.fn() };
    mockWrapper = {};
    authPage = new AuthPage(mockWrapper, mockRouter);
  });

  /**
   * Тест на создание экземпляра страницы аутентификации.
   * Проверяет, что экземпляр создан корректно и содержит необходимые свойства.
   */
  it("Создает экземпляры страницы аутентификации", () => {
    expect(authPage).toBeInstanceOf(AuthPage);
    expect(authPage.wrapper).toBe(mockWrapper);
    expect(authPage.router).toBe(mockRouter);
    expect(authPage.formAuth).toBeInstanceOf(FormAuth);
    expect(authPage.loader).toBeInstanceOf(Loader);
  });

  /**
   * Тест на рендеринг модального окна с формой аутентификации.
   * Проверяет, что модальное окно рендерится с правильными элементами.
   */
  it("Рендерит модальное окно с формой аутентификации", () => {
    const container = el("div");
    authPage.render(container);

    const mockEl = jest.requireMock("redom").el;

    expect(mockEl).toHaveBeenCalledWith("div.modal", { id: "modal", "aria-hidden": "true" });
    expect(mockEl).toHaveBeenCalledWith("div.modal__content");
    expect(mockEl).toHaveBeenCalledWith("h2.title.modal__title", "Вход в аккаунт");

    expect(authPage.formAuth.render).toHaveBeenCalled();
  });

  /**
   * Тест на монтирование модального окна в контейнер.
   * Проверяет, что модальное окно монтируется корректно.
   */
  it("Монтирует в контейнер", () => {
    const container = el("div");
    authPage.render(container);

    const mockMount = jest.requireMock("redom").mount;

    expect(mockMount).toHaveBeenCalledWith(container, authPage.modalAuth);
  });
});
