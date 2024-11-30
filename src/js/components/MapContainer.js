import { el, mount } from "redom";
import YAMap from "../utils/yamap.js";
import ErrorDisplay from "../components/Error.js";
import { configSkeletonItem } from "../config/configSkeletonItem.js";

/**
 * Класс MapContainer отвечает за создание и отображение карты с банкоматами.
 *
 * Этот класс управляет инициализацией карты, отображением маркеров банкоматов,
 * а также обработкой состояния загрузки и ошибок.
 *
 * @export
 * @class MapContainer
 * @typedef {MapContainer}
 */
export default class MapContainer {
  /**
   * Создание экземпляра класса MapContainer.
   *
   * @constructor
   * @param {string} token - Токен для аутентификации при работе с API карт.
   * @param {Object} mapPage - Экземпляр класса ATMMapPage, к которому относится контейнер карты.
   */
  constructor(token, mapPage) {
    this.token = token;
    this.mapPage = mapPage;
    this.mapInstance = null;
    this.error = null;
    this.errorDisplay = new ErrorDisplay();
    this.mapContainer = null;
  }

  /**
   * Рендерит контейнер карты в указанном контейнере.
   *
   * Этот метод создает элемент карты и монтирует его в родительский контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет смонтирована карта.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    this.mapContainer = el("div.map__yandex", { id: "map" });
    mount(container, this.mapContainer);
  }

  /**
   * Инициализирует экземпляр карты с заданными параметрами.
   *
   * Этот метод создает экземпляр карты и устанавливает её начальные параметры,
   * такие как центр и уровень масштабирования.
   *
   * @async
   * @returns {Promise<void>} - Возвращает промис, который разрешается, когда карта готова.
   */
  async initMap() {
    this.mapInstance = new YAMap(
      "map",
      {
        center: [55.75396, 37.62044],
        zoom: 10,
        controls: ["searchControl", "typeSelector", "trafficControl"],
      },
      process.env.API_KEY_MAP
    );

    return this.mapInstance.ready;
  }

  /**
   * Обновляет состояние карты и отображает маркеры банкоматов.
   *
   * Этот метод обновляет данные о банкоматах, состояние загрузки и ошибки.
   *
   * @async
   * @param {Array<Object>} banks - Массив объектов, представляющих банкоматы.
   * @param {boolean} isLoading - Флаг, указывающий, происходит ли загрузка данных.
   * @param {string|null} error - Сообщение об ошибке, если она произошла.
   * @returns {Promise<void>} - Не возвращает значение.
   */
  async update(banks, isLoading, error) {
    this.banks = banks;
    this.isLoading = isLoading;
    this.error = error;

    this.renderATMMarks();
  }

  /**
   * Отображает маркеры банкоматов на карте в зависимости от состояния загрузки и ошибок.
   *
   * Этот метод управляет отображением элементов, таких как индикаторы загрузки и сообщения об ошибках.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderATMMarks() {
    const mapContainer = this.mapContainer;

    if (this.isLoading && this.error === null) {
      mapContainer.classList.add("map__yandex--loading", "sm-loading");
      mapContainer.dataset.smConfig = configSkeletonItem;
      const loadingItem = el("div.map__yandex-load.sm-item-primary");
      mapContainer.innerHTML = "";
      mount(mapContainer, loadingItem);
      return;
    } else {
      mapContainer.classList.remove("map__yandex--loading", "sm-loading");
      delete mapContainer.dataset.smConfig;
      const loadingItems = mapContainer.querySelectorAll(".map__yandex-load.sm-item-primary");
      loadingItems.forEach((item) => item.remove());
    }

    if (this.error && !this.isLoading) {
      mapContainer.classList.add("map__yandex--error");
      const errorItem = el("div.map__yandex-failed", `Error: ${this.error}`);
      mapContainer.innerHTML = "";
      mount(mapContainer, errorItem);
      return;
    } else {
      mapContainer.classList.remove("map__yandex--error");
      mapContainer.querySelector("div.map__yandex-failed")?.remove();
    }

    if (this.mapInstance) {
      this.mapInstance.addMarkersFromData(this.banks);
    }
  }
}
