import { el, mount } from "redom";
import { Header } from "./components/Header.js";
import { Main } from "./components/Main.js";
import AuthPage from "./pages/pageAuth.js";
import ScoreListPage from "./pages/pageScoreList.js";
import ScoreItemPage from "./pages/pageScoreItem.js";
import ScoreItemHistoryPage from "./pages/pageScoreHistory.js";
import ATMMapPage from "./pages/pageATMMap.js";
import CurrencyPage from "./pages/pageCurrency.js";
import NotFoundPage from "./pages/pageNotFound.js";
import Navigo from "navigo";
import Cookies from "js-cookie";
import { config } from "./config/configRouter.js";
import { cache } from "./config/configCache.js";

/**
 * Класс App управляет маршрутизацией и отображением страниц приложения.
 *
 * Этот класс инициализирует маршрутизатор, загружает заголовок и основное содержимое,
 * а также обрабатывает навигацию между различными страницами приложения.
 *
 * @export
 * @class App
 * @typedef {App}
 */
export class App {
  /**
   * Создает экземпляр класса App.
   *
   * @constructor
   */
  constructor() {
    this.router = new Navigo(config.routes.base, { hash: true });
    this.wrapper = el("div.wrapper");
    this.header = new Header(this.router, this);
    this.main = new Main(this.wrapper);
  }

  /**
   * Инициализация приложения.
   *
   * Этот метод монтирует обертку приложения в DOM, рендерит заголовок и основное содержимое,
   * а также настраивает маршруты для навигации.
   *
   * @returns {void} - Не возвращает значение.
   */
  init() {
    const appElement = document.getElementById("app");
    if (appElement) {
      mount(appElement, this.wrapper);
      this.header.render(this.wrapper);
      this.main.render(this.wrapper);
    }

    this.router
      .on(config.routes.auth, () => this.renderPage(AuthPage, "auth"))
      .on(config.routes.score, () => this.checkTokenAndNavigate(ScoreListPage, "score"))
      .on(config.routes.scoreItem, (params) => {
        this.checkTokenAndNavigate(ScoreItemPage, "scoreItem", params.data.id);
      })
      .on(config.routes.scoreItemHistory, (params) => {
        this.checkTokenAndNavigate(ScoreItemHistoryPage, "scoreItemHistory", params.data.id);
      })
      .on(config.routes.banks, () => this.checkTokenAndNavigate(ATMMapPage, "banks"))
      .on(config.routes.currency, () => this.checkTokenAndNavigate(CurrencyPage, "currency"))
      .notFound(() => this.checkTokenAndNavigate(NotFoundPage, "*"))
      .resolve();
  }

  /**
   * Рендер страницы на основе переданного класса страницы.
   *
   * Этот метод очищает текущее содержимое основного элемента и создает новый экземпляр
   * класса страницы, затем рендерит его в указанном элементе.
   *
   * @async
   * @param {Function} PageClass - Класс страницы, который нужно отобразить.
   * @param {string} route - Название маршрута для обновления навигации.
   * @param {string|null} [id=null] - Идентификатор элемента, если требуется.
   * @returns {Promise<void>} - Не возвращает значение.
   */
  async renderPage(PageClass, route, id = null) {
    const mainElement = document.querySelector("main.main");
    if (mainElement) {
      mainElement.innerHTML = "";
      const page = new PageClass(this.wrapper, this.router, id);
      await page.render(mainElement, id);
    }
    this.header.updateNavigation(route);
    if (route === config.routes.auth) {
      this.handleAuthRoute();
      this.clearCache();
    }
  }

  /**
   * Проверка наличия токена и выполнение навигации к указанной странице.
   *
   * Если токен существует, рендерит указанную страницу. В противном случае
   * перенаправляет пользователя на страницу авторизации.
   *
   * @async
   * @param {Function} PageClass - Класс страницы, к которой нужно перейти.
   * @param {string} pageRoute - Название маршрута для обновления навигации.
   * @param {string|null} [id=null] - Идентификатор элемента, если требуется.
   * @returns {Promise<void>} - Не возвращает значение.
   */
  async checkTokenAndNavigate(PageClass, pageRoute, id = null) {
    const token = Cookies.get("token");
    if (token) {
      this.header.updateNavigation(pageRoute);
      await this.renderPage(PageClass, pageRoute, id);
    } else {
      this.navigateTo(config.routes.auth);
    }
  }

  /**
   * Навигация к указанному маршруту.
   *
   * Этот метод использует маршрутизатор для перехода к указанному маршруту.
   *
   * @param {string} route - Маршрут, к которому нужно перейти.
   * @returns {void} - Не возвращает значение.
   */
  navigateTo(route) {
    this.router.navigate(route);
  }

  /**
   * Очистка кэша данных приложения.
   *
   * Этот метод сбрасывает все данные кэша, связанные со счетами,
   * банкоматами и валютами.
   *
   * @returns {void} - Не возвращает значение.
   */
  clearCache() {
    cache.scores = null;
    cache.scoresId = null;
    cache.banks = null;
    cache.allCurrencies = null;
    cache.currencies = null;
    cache.lastFetch.scores = null;
    cache.lastFetch.scoresId = null;
    cache.lastFetch.banks = null;
    cache.lastFetch.allCurrencies = null;
    cache.lastFetch.currencies = null;
  }

  /**
   * Обработка перехода на страницу авторизации.
   *
   * Если токен существует, он удаляется, очищается кэш,
   * и пользователь перенаправляется на страницу авторизации.
   *
   * @returns {void} - Не возвращает значение.
   */
  handleAuthRoute() {
    const token = Cookies.get("token");
    if (token) {
      Cookies.remove("token");
      this.clearCache();
      this.navigateTo(config.routes.auth);
    }
  }
}
