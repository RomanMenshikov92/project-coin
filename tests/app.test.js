import { App } from "../src/js/app.js"; // Путь к вашему классу App
import Navigo from "navigo";
import Cookies from "js-cookie";
import { config } from "../src/js/config/configRouter.js";
import { cache } from "../src/js/config/configCache.js";

/**
 * Мокирование зависимостей
 *
 * Мы используем jest.mock для имитации зависимостей нашего приложения.
 * Это позволяет нам изолировать наш код и протестировать его более эффективно.
 */
jest.mock("navigo");
Navigo.prototype.navigate = jest.fn();
jest.mock("js-cookie");
jest.mock("../src/assets/images/Logo.svg", () => ({ default: "mock-svg" }));
jest.mock("../src/assets/images/logo_visa.png", () => ({ default: "mock-svg" }));
jest.mock("../src/assets/images/logo_mastercard.png", () => ({ default: "mock-svg" }));
jest.mock("../src/assets/images/logo_mir.png", () => ({ default: "mock-svg" }));
jest.mock("../src/assets/images/logo_maestro.png", () => ({ default: "mock-svg" }));
jest.mock("../src/assets/images/logo_american-express.png", () => ({ default: "mock-svg" }));
jest.mock("../src/assets/images/logo_bitcoin.png", () => ({ default: "mock-svg" }));
jest.mock("../src/js/components/Header.js", () => {
  return {
    Header: jest.fn().mockImplementation(() => {
      return {
        render: jest.fn(),
        updateNavigation: jest.fn(),
      };
    }),
  };
});
jest.mock("../src/js/components/Main.js", () => {
  return {
    Main: jest.fn().mockImplementation(() => {
      return {
        render: jest.fn(),
      };
    }),
  };
});

/**
 * Тесты для класса App.
 * @module AppTests
 */
describe("App", () => {
  let app;
  let mockRouter;
  let mockWrapper;

  /**
   * Настройка среды тестирования перед выполнением всех тестов.
   * Создает виртуальный DOM с помощью jsdom.
   */
  beforeAll(() => {
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
    global.document = dom.window.document;
    global.window = dom.window;
  });

  /**
   * Настройка среды тестирования перед каждым тестом.
   * Создает новый экземпляр класса App и добавляет моки в DOM.
   */
  beforeEach(() => {
    mockRouter = new Navigo();
    mockWrapper = document.createElement("div");
    document.body.appendChild(mockWrapper);
    app = new App();
  });

  /**
   * Очистка после каждого теста.
   * Удаляет мок обертку из DOM и очищает все моки Jest.
   */
  afterEach(() => {
    document.body.removeChild(mockWrapper);
    jest.clearAllMocks();
  });

  /**
   * Тест на создание экземпляра класса App.
   * Проверяет, что экземпляр класса был создан правильно.
   */
  it("Создает экземпляры главного приложения", () => {
    expect(app).toBeInstanceOf(App);
    expect(app.router).toBeInstanceOf(Navigo);
    expect(app.wrapper).toBeDefined();
  });

  /**
   * Тест на инициализацию приложения.
   * Проверяет, что приложение инициализируется корректно и содержит необходимые элементы.
   */
  it("Инициализация приложения", () => {
    const appElement = document.getElementById("app");
    if (appElement) {
      expect(appElement.innerHTML).toContain("div.wrapper");
      expect(app.header).toBeDefined();
      expect(app.main).toBeDefined();
    }
  });

  /**
   * Тест на рендер страницы на основе переданного класса страницы.
   * @async
   * @returns {Promise<void>} Возвращает промис, который разрешается после рендеринга страницы.
   */
  it("Рендер страницы на основе переданного класса страницы", async () => {
    class MockPage {
      /**
       * Создает экземпляр MockPage.
       * @param {HTMLElement} wrapper - Обертка для страницы.
       * @param {Navigo} router - Экземпляр маршрутизатора.
       * @param {string} id - Идентификатор страницы.
       */
      constructor(wrapper, router, id) {
        this.wrapper = wrapper;
        this.router = router;
        this.id = id;
      }
      /**
       * Рендерит содержимое страницы.
       * @async
       * @param {HTMLElement} mainElement - Элемент, в который будет помещено содержимое.
       * @param {string} id - Идентификатор страницы.
       * @returns {Promise<void>} Возвращает промис, который разрешается после завершения рендеринга.
       */
      async render(mainElement, id) {
        mainElement.innerHTML = `<div>Mock Page Content</div>`;
      }
    }
    const appElement = document.createElement("div");
    appElement.id = "app";
    document.body.appendChild(appElement);
    const mainElement = document.createElement("main");
    mainElement.className = "main";
    appElement.appendChild(mainElement);
    await app.renderPage(MockPage, "mockRoute");
    expect(mainElement.innerHTML).toContain("Mock Page Content");
    expect(app.header.updateNavigation).toHaveBeenCalledWith("mockRoute");
    document.body.removeChild(appElement);
  });

  /**
   * Тест на проверку наличия токена и выполнение навигации к указанной странице.
   * @async
   * @returns {Promise<void>} Возвращает промис, который разрешается после проверки токена и навигации.
   */
  it("Проверка наличия токена и выполнение навигации к указанной странице", async () => {
    const pageRoute = "mockRoute";
    const MockPage = jest.fn().mockImplementation(() => {
      return {
        render: jest.fn(),
      };
    });

    jest.spyOn(Cookies, "get").mockReturnValue("token");
    jest.spyOn(app, "renderPage").mockResolvedValue();
    await app.checkTokenAndNavigate(MockPage, pageRoute);
    expect(app.header.updateNavigation).toHaveBeenCalledWith(pageRoute);
    expect(app.renderPage).toHaveBeenCalledWith(MockPage, pageRoute, null);
    expect(Cookies.get).toHaveBeenCalledWith("token");

    Cookies.get.mockRestore();
    app.renderPage.mockRestore();
    jest.spyOn(Cookies, "get").mockReturnValue(null);
    jest.spyOn(app, "navigateTo").mockImplementation(() => {});
    await app.checkTokenAndNavigate(MockPage, pageRoute);
    expect(app.navigateTo).toHaveBeenCalledWith(config.routes.auth);
    expect(Cookies.get).toHaveBeenCalledWith("token");
  });

  /**
   * Тест на навигацию к указанному маршруту.
   * Проверяет, что метод navigate вызывается с правильным маршрутом.
   */
  it("Навигация к указанному маршруту", () => {
    jest.spyOn(app.router, "navigate");
    app.navigateTo("mockRoute");
    expect(app.router.navigate).toHaveBeenCalledWith("mockRoute");
  });

  /**
   * Тест на очистку кэша.
   * Проверяет, что кэш очищается корректно.
   */
  it("Очистка кэша", () => {
    cache.scores = "test";
    cache.scoresId = "test";
    cache.banks = "test";
    cache.allCurrencies = "test";
    cache.currencies = "test";
    cache.lastFetch.scores = "test";
    cache.lastFetch.scoresId = "test";
    cache.lastFetch.banks = "test";
    cache.lastFetch.allCurrencies = "test";
    cache.lastFetch.currencies = "test";

    app.clearCache();

    expect(cache.scores).toBeNull();
    expect(cache.scoresId).toBeNull();
    expect(cache.banks).toBeNull();
    expect(cache.allCurrencies).toBeNull();
    expect(cache.currencies).toBeNull();
    expect(cache.lastFetch.scores).toBeNull();
    expect(cache.lastFetch.scoresId).toBeNull();
    expect(cache.lastFetch.banks).toBeNull();
    expect(cache.lastFetch.allCurrencies).toBeNull();
    expect(cache.lastFetch.currencies).toBeNull();
  });

  /**
   * Тест на обработку перехода на страницу авторизации.
   * Проверяет, что токен удаляется и происходит навигация на страницу авторизации.
   */
  it("Обработка перехода на страницу авторизации", () => {
    jest.spyOn(Cookies, "get").mockReturnValue("token");
    jest.spyOn(Cookies, "remove");
    jest.spyOn(app, "navigateTo");

    app.handleAuthRoute();

    expect(Cookies.remove).toHaveBeenCalledWith("token");
    expect(app.navigateTo).toHaveBeenCalledWith(config.routes.auth);
  });
});
