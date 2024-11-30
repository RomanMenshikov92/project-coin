import ymaps from "ymaps";

/**
 * Класс для работы с картами Яндекс.
 *
 * Этот класс инициализирует карту Яндекс и предоставляет методы для добавления маркеров.
 *
 * @export
 * @class YAMap
 * @typedef {YAMap}
 */
export default class YAMap {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {string} containerId - ID HTML элемента, в котором будет отображаться карта.
   * @param {Object} options - Опции для настройки карты.
   * @param {string} apiKey - API ключ для доступа к Яндекс.Картам.
   */
  constructor(containerId, options, apiKey) {
    this.containerId = containerId;
    this.options = options;
    this.apiKey = apiKey;
    this.map = null;
    this.maps = null;

    this.ready = new Promise((resolve, reject) => {
      if (!document.getElementById(this.containerId)) {
        return null;
      }
      ymaps
        .load(`https://api-maps.yandex.ru/2.1/?apikey=${this.apiKey}&lang=ru_RU`)
        .then((maps) => {
          this.map = new maps.Map(this.containerId, this.options);
          this.maps = maps;
          resolve(this.map);
        })
        .catch((error) => {
          // reject(error);
        });
    });
  }

  /**
   * Настройка маркера.
   *
   * Этот метод добавляет маркер на карту по заданным координатам и устанавливает балун-метки.
   *
   * @param {Array<number>} coordinates - Массив с координатами [широта, долгота].
   * @throws {Error} - Генерирует ошибку, если карта не инициализирована.
   *
   */
  addMarker(coordinates) {
    if (!this.maps) {
      throw new Error("Карта еще не инициализирована!");
    }

    const placemark = new this.maps.Placemark(
      coordinates,
      {
        balloonContent: `<strong>Банкомат &#171;Coin&#187;</strong>`,
      },
      {
        preset: "islands#icon",
        iconColor: "#0095b6",
      }
    );

    this.map.geoObjects.add(placemark);
  }

  /**
   * Добавление несколько маркеров на карту.
   *
   * Этот метод добавляет маркеры на карту по заданным координатам.
   *
   * @param {Array<Object>} banks - Массив объектов, содержащих данные о банках.
   * @param {number} banks[].lat - Широта маркера.
   * @param {number} banks[].lon - Долгота маркера.
   *
   */
  addMarkersFromData(banks) {
    this.ready.then(() => {
      banks.forEach((mark) => {
        this.addMarker([mark.lat, mark.lon]);
      });
    });
  }
}
