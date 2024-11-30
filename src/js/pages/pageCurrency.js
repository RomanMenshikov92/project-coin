import { el, mount } from "redom";
import DivCurrencyYours from "../components/CurrencyYours.js";
import DivCurrencyExchange from "../components/CurrencyExchange.js";
import DivCurrencyRate from "../components/CurrencyRate.js";
import Cookies from "js-cookie";
import Loader from "../components/Loader.js";
import { getAllCurrencies, getYourCurrencies, websocketCurrencyFeed } from "../api/fetchCurrency.js";
import ErrorDisplay from "../components/Error.js";
import { cache, isCacheValid } from "../config/configCache.js";
import { addDragAndDropHandlers, dragStart, dragOver, drop, dragEnd } from "../utils/dragAndDrop.js";

/**
 * Класс CurrencyPage отвечает за рендеринг страницы валют.
 *
 * Этот класс создает и управляет компонентами, связанными с валютами,
 * включая отображение всех доступных валют, валют пользователя и курсов валют.
 *
 * @export
 * @class CurrencyPage
 * @typedef {CurrencyPage}
 */
export default class CurrencyPage {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {HTMLElement} wrapper - Элемент-обертка, в который будет монтироваться страница валют.
   * @param {Object} router - Объект маршрутизатора для навигации между страницами.
   */
  constructor(wrapper, router) {
    this.wrapper = wrapper;
    this.router = router;
    this.token = Cookies.get("token");
    this.allCurrencies = [];
    this.yoursCurrencies = {};
    this.ratesCurrencies = {};
    this.error = null;
    this.isLoading = true;
    this.errorDisplay = new ErrorDisplay();
    this.divCurrencyYours = new DivCurrencyYours(this.token, this);
    this.divCurrencyExchange = new DivCurrencyExchange(this.token, this);
    this.divCurrencyRate = new DivCurrencyRate(this.token, this);
    this.loader = new Loader();
    this.socketDataReceived = false;
  }

  /**
   * Рендер страницы валют.
   *
   * Этот метод создает структуру страницы, отображает заголовок и блоки компонентов.
   * Если данные о валютах кэшированы и действительны, они будут использованы для отображения.
   * В противном случае будет выполнен запрос на получение данных о валютах.
   *
   * @async
   * @param {HTMLElement} container - Контейнер, где будет располагаться блок валют.
   * @returns {Promise<void>} - Не возвращает значение.
   */
  async render(container) {
    const sectionCurrency = el("section.currency");
    const containerCurrency = el("div.container.currency__container");

    const currencyTitle = el("h2.title.currency__title", "Валютный обмен");

    const blocksCurrency = el(".currency__blocks");

    mount(containerCurrency, currencyTitle);
    this.divCurrencyYours.render(blocksCurrency);
    this.divCurrencyExchange.render(blocksCurrency);
    this.divCurrencyRate.render(blocksCurrency);

    mount(containerCurrency, blocksCurrency);
    mount(sectionCurrency, containerCurrency);
    mount(container, sectionCurrency);

    addDragAndDropHandlers(sectionCurrency, dragStart, dragOver, drop, dragEnd);

    const cachedCurrencies = cache.currencies;
    const cachedAllCurrencies = cache.allCurrencies;
    if (cachedCurrencies && cachedAllCurrencies && isCacheValid("currencies")) {
      this.updateComponentsBefore();
      this.isLoading = false;
      this.error = null;
      this.initWebSocket();
      this.updateComponentsAfter(cachedAllCurrencies, cachedCurrencies);
      return;
    }

    try {
      this.updateComponentsBefore();
      const [fullCurrencies, thyCurrencies] = await Promise.all([
        this.getFullCurrencies(),
        this.getThyCurrencies(),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      if (this.error) {
        this.handleError(container);
        return;
      }
      this.initWebSocket();
      this.updateComponentsAfter(fullCurrencies, thyCurrencies);
    } catch (error) {
      this.handleError(container, error);
    }
  }

  /**
   * Запрос данных о всех валютах.
   *
   * Этот метод выполняет запрос к API для получения информации о всех валютах,
   * обновляет кэш и состояние компонента в зависимости от результата запроса.
   *
   * @async
   * @returns {Promise<{ payload: Array<string> }|{ error: string }|null>} - Возвращает асинхронный промис.
   *   - payload (Array<string>): Массив строк, представляющих валюты, если операция была успешной.
   *   - error (string): Сообщение об ошибке, если операция не была успешной.
   */
  async getFullCurrencies() {
    try {
      const response = await getAllCurrencies(this.token);
      if (response.error) {
        this.allCurrencies = [];
        this.isLoading = false;
        this.error = response.error;
        return response.error;
      } else {
        cache.allCurrencies = response.payload;
        cache.lastFetch.allCurrencies = Date.now();
        this.allCurrencies = response.payload;
        this.isLoading = false;
        this.error = null;
        return response.payload;
      }
    } catch (error) {
      this.error = error;
      this.isLoading = false;
      return { error };
    }
  }

  /**
   * Запрос данных о валютах пользователя.
   *
   * Этот метод выполняет запрос к API для получения информации о своих валютах,
   * обновляет кэш и состояние компонента в зависимости от результата запроса.
   *
   * @async
   * @returns {Promise<{ payload: Object<Object> }|{ error: string }|null>}- Возвращает асинхронный промис.
   *   - payload (Object<Object>): Объект, который содержит ключи в виде кодов валют, где каждое значение представляет собой объект, содержащий информацию о валюте пользователя, если операция была успешной
   *   - error (string): Сообщение об ошибке, если операция не была успешной.
   */
  async getThyCurrencies() {
    try {
      const response = await getYourCurrencies(this.token);
      if (response.error) {
        this.yoursCurrencies = {};
        this.isLoading = false;
        this.error = response.error;
        return response.error;
      } else {
        cache.currencies = response.payload;
        cache.lastFetch.currencies = Date.now();
        this.yoursCurrencies = response.payload;
        this.isLoading = false;
        this.error = null;
        return response.payload;
      }
    } catch (error) {
      this.error = error;
      this.isLoading = false;
      return { error };
    }
  }

  /**
   * Инициализация WebSocket для получения обновлений курсов валют.
   *
   * Этот метод устанавливает соединение с WebSocket и обрабатывает полученные данные о курсах валют.
   * При получении данных обновляет компоненты и состояние.
   *
   * @returns {void} - Не возвращает значение.
   */
  initWebSocket() {
    this.updateComponentsBefore();
    websocketCurrencyFeed(
      this.token,
      (from, to, rate, change) => {
        if (!this.socketDataReceived) {
          console.log("Данные сокета получены");
          this.socketDataReceived = true;
          this.isLoading = false;
          this.error = null;
        }
        this.handleCurrencyUpdate(from, to, rate, change);
      },
      (error) => {
        this.isLoading = false;
        this.error = error;
        this.handleError(error);
      }
    );
  }

  /**
   * Обработка обновлений курсов валют.
   *
   * Этот метод обновляет состояние курсов валют и обновляет соответствующий компонент.
   *
   * @param {string} from - Код валюты, из которой происходит обмен.
   * @param {string} to - Код валюты, в которую происходит обмен.
   * @param {number} rate - Обновленный курс обмена.
   * @param {number} change - Изменение курса обмена.
   */
  handleCurrencyUpdate(from, to, rate, change) {
    this.ratesCurrencies[`${from}/${to}`] = { from, to, rate, change };
    this.divCurrencyRate.update(this.ratesCurrencies, this.isLoading, null);
  }

  /**
   * Обновление компонента перед загрузкой данных.
   *
   * Этот метод устанавливает состояние загрузки и очищает данные валют перед получением новых данных.
   *
   * @returns {void} - Не возвращает значение.
   */
  updateComponentsBefore() {
    this.divCurrencyYours.update({}, this.isLoading, null);
    this.divCurrencyExchange.update([], {}, this.isLoading, null);
    this.divCurrencyRate.update({}, this.isLoading, null);
  }

  /**
   * Обновление компонента после загрузки данных.
   *
   * Этот метод обновляет состояние компонентов с новыми данными о валютах.
   *
   * @param {Array<string>} fullCurrencies - Все доступные валюты.
   * @param {Object<Object>} thyCurrencies - Валюты пользователя.
   * @returns {void} - Не возвращает значение.
   */
  updateComponentsAfter(fullCurrencies, thyCurrencies) {
    this.divCurrencyYours.update(thyCurrencies, this.isLoading, null);
    this.divCurrencyExchange.update(fullCurrencies, thyCurrencies, this.isLoading, null);
    // this.divCurrencyRate.update(ratesCurrencies, this.isLoading, null);
  }

  /**
   * Обработка ошибок и отображение сообщении об ошибке.
   *
   * Этот метод отвечает за отображение сообщения об ошибке в случае неудачи при получении данных или других проблемах.
   *
   * @param {HTMLElement} container - Контейнер, где будет отображаться ошибка.
   * @param {Error} [error=this.error]  - Ошибка, которую нужно обработать (по умолчанию последняя ошибка).
   * @returns {void} - Не возвращает значение.
   */
  handleError(container, error = this.error) {
    console.error(error);
    this.error = error;
    this.isLoading = false;
    this.errorDisplay.show(container, error.message || error);
    this.divCurrencyYours.update({}, false, this.error);
    this.divCurrencyExchange.update([], {}, false, this.error);
    this.divCurrencyRate.update({}, false, this.error);
  }
}
