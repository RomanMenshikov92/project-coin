import { el, mount } from "redom";
import Loader from "../components/Loader.js";
import { getBankATMs } from "../api/fetchATM.js";
import Cookies from "js-cookie";
import ErrorDisplay from "../components/Error.js";
import MapContainer from "../components/MapContainer.js";
import { cache, isCacheValid } from "../config/configCache.js";

/**
 * Класс ATMMapPage отвечает за рендеринг страницы с картой банкоматов.
 *
 * Этот класс управляет состоянием страницы, загружает данные о банкоматах
 * и отображает их на карте. Он также обрабатывает ошибки и состояние загрузки.
 *
 * @export
 * @class ATMMapPage
 * @typedef {ATMMapPage}
 */
export default class ATMMapPage {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {HTMLElement} wrapper - Элемент-обертка, в который будет монтироваться страница карты банкоматов.
   * @param {Object} router - Объект маршрутизатора для навигации между страницами.
   */
  constructor(wrapper, router) {
    this.wrapper = wrapper;
    this.router = router;
    this.token = Cookies.get("token");
    this.banks = [];
    this.error = null;
    this.isLoading = true;
    this.errorDisplay = new ErrorDisplay();
    this.loaderBounce = new Loader();
    this.mapContainer = new MapContainer(this.token, this);
  }

  /**
   * Рендер страницы карты банкоматов
   *
   * Этот метод создает структуру страницы, отображает заголовок и инициализирует карту.
   * Если данные о банкоматах кэшированы и действительны, они будут использованы для отображения.
   * В противном случае будет выполнен запрос на получение данных о банкоматах.
   *
   * @async
   * @param {HTMLElement} container - контейнер, где будет располагаться карта банкоматов
   * @returns {Promise<void>} - Не возвращает значение
   */
  async render(container) {
    const sectionMap = el("section.map");
    const containerMap = el("div.container.map__container");

    const mapTitle = el("h2.title.map__title", "Карта банкоматов");

    mount(containerMap, mapTitle);
    this.mapContainer.render(containerMap);

    mount(sectionMap, containerMap);
    mount(container, sectionMap);

    const cachedBanks = cache.banks;
    if (cachedBanks && isCacheValid("banks")) {
      this.updateComponentsBefore();
      this.isLoading = false;
      this.error = null;
      await this.mapContainer.initMap();
      this.updateComponentsAfter(cachedBanks);
      return;
    }

    try {
      this.updateComponentsBefore();
      const [banks] = await Promise.all([this.getBanks(), new Promise((resolve) => setTimeout(resolve, 1000))]);

      if (this.error) {
        this.handleError(container);
        return;
      }
      await this.mapContainer.initMap();
      this.updateComponentsAfter(banks);
    } catch (error) {
      this.handleError(container, error);
    }
  }

  /**
   * Запрос данных о банкоматах.
   *
   * Этот метод выполняет запрос к API для получения информации о банкоматах,
   * обновляет кэш и состояние компонента в зависимости от результата запроса.
   *
   * @async
   * @returns {Promise<{ payload: Array<Object> }|{ error: string }|null>} - Возвращает асинхронный промис,
   *  который может содержать:
   *   - payload (Array<Object>): Массив объектов, представляющих банкоматы, если операция была успешной.
   *   - error (string): Сообщение об ошибке, если операция не была успешной.
   */
  async getBanks() {
    try {
      const response = await getBankATMs(this.token);
      if (response.error) {
        this.banks = [];
        this.isLoading = false;
        this.error = response.error;
        return response.error;
      } else {
        cache.banks = response.payload;
        cache.lastFetch.banks = Date.now();
        this.banks = response.payload;
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
   * Обновление компонента перед загрузкой данных.
   *
   * Этот метод устанавливает состояние загрузки и очищает данные карты перед получением новых данных.
   *
   * @returns {void} - Не возвращает значение.
   */
  updateComponentsBefore() {
    this.mapContainer.update([], this.isLoading, null);
  }

  /**
   * Обновление компонента после загрузки данных.
   *
   * Этот метод обновляет состояние карты с новыми данными о банкоматах.
   *
   * @param {Array<Object>} banks - Массив банкоматов для отображения.
   * @returns {void} - Не возвращает значение.
   */
  updateComponentsAfter(banks) {
    this.mapContainer.update(banks, this.isLoading, null);
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
    this.mapContainer.update([], false, this.error);
  }
}
