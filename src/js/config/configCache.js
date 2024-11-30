/**
 * Объект кэша, который хранит данные и время последнего их обновления.
 * @type {Object}
 * @property {Array|null} scores - Кэшированные оценки. Изначально null.
 * @property {Array|null} scoresId - Кэшированные идентификаторы оценок. Изначально null.
 * @property {Array|null} banks - Кэшированные данные о банках. Изначально null.
 * @property {Array|null} allCurrencies - Кэшированные данные о всех валютах. Изначально null.
 * @property {Array|null} currencies - Кэшированные данные о валютах. Изначально null.
 * @property {Object} lastFetch - Объект, содержащий время последнего обновления кэша.
 * @property {number|null} lastFetch.scores - Время последнего обновления кэша оценок. Изначально null.
 * @property {number|null} lastFetch.scoresId - Время последнего обновления кэша идентификаторов оценок. Изначально null.
 * @property {number|null} lastFetch.banks - Время последнего обновления кэша банков. Изначально null.
 * @property {number|null} lastFetch.allCurrencies - Время последнего обновления кэша всех валют. Изначально null.
 * @property {number|null} lastFetch.currencies - Время последнего обновления кэша валют. Изначально null.
 */
export const cache = {
  scores: null,
  scoresId: null,
  banks: null,
  allCurrencies: null,
  currencies: null,
  lastFetch: {
    scores: null,
    scoresId: null,
    banks: null,
    allCurrencies: null,
    currencies: null,
  },
};

/**
 * Проверяет, является ли кэш для заданного ключа действительным на основе времени его последнего обновления.
 *
 * @param {string} key - Ключ кэша, который нужно проверить. Должен соответствовать одному из свойств объекта `cache.lastFetch`.
 * @param {number} [duration=300000] - Длительность (в миллисекундах), в течение которой кэш считается действительным. По умолчанию 5 минут (300000 мс).
 * @returns {boolean} Возвращает true, если кэш действителен, и false в противном случае.
 */
export function isCacheValid(key, duration = 5 * 60 * 1000) {
  const now = Date.now();
  return cache.lastFetch[key] && now - cache.lastFetch[key] < duration;
}
