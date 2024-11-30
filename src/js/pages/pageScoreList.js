import { el, mount } from "redom";
import BtnScore from "../components/ScoreBtn.js";
import SelectScore from "../components/ScoreSelect.js";
import ListScore from "../components/ScoreList.js";
import Cookies from "js-cookie";
import { getScores } from "../api/fetchScore.js";
import ErrorDisplay from "../components/Error.js";
import Loader from "../components/Loader.js";
import { cache, isCacheValid } from "../config/configCache.js";
import { addDragAndDropHandlers, dragStart, dragOver, drop, dragEnd } from "../utils/dragAndDrop.js";

/**
 * Класс ScoreListPage отвечает за рендеринг страницы со счетами пользователя.
 *
 * Этот класс создает и управляет компонентами, связанными с отображением счетов,
 * включая выбор счетов, список счетов и кнопку для выполнения действий со счетами.
 *
 * @export
 * @class ScoreListPage
 * @typedef {ScoreListPage}
 */
export default class ScoreListPage {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {HTMLElement} wrapper - Элемент-обертка, в который будет монтироваться страница счетов пользователя.
   * @param {Object} router - Объект маршрутизатора для навигации между страницами.
   */
  constructor(wrapper, router) {
    this.wrapper = wrapper;
    this.router = router;
    this.token = Cookies.get("token");
    this.accounts = [];
    this.error = null;
    this.isLoading = true;
    this.errorDisplay = new ErrorDisplay();
    this.listScore = new ListScore(this.router, this.token, this);
    this.selectScore = new SelectScore(this);
    this.btnScore = new BtnScore(this.token, this);
    this.loader = new Loader();
  }

  /**
   * Рендер страницы со счетами.
   *
   * Этот метод создает структуру страницы, отображает заголовок и блок компонентов.
   * Если данные о счетах кэшированы и действительны, они будут использованы для отображения.
   * В противном случае будет выполнен запрос на получение данных о счетах.
   *
   * @async
   * @param {HTMLElement} container - Контейнер, где будет располагаться блок счетов.
   * @returns {Promise<void>} - Не возвращает значение.
   */
  async render(container) {
    const sectionScores = el("section.score");
    const containerScores = el("div.container.score__container");

    const scoresDivTop = el("div.score__top", { id: "draggable-top", draggable: true });
    const scoresDivBottom = el("div.score__bottom", { id: "draggable-bottom", draggable: true });

    const scoresTitle = el("h2.title.score__top-title", "Ваши счета");

    mount(scoresDivTop, scoresTitle);
    mount(containerScores, scoresDivTop);
    mount(containerScores, scoresDivBottom);
    this.selectScore.render(scoresDivTop);
    this.btnScore.render(scoresDivTop);
    this.listScore.render(scoresDivBottom);

    mount(sectionScores, containerScores);
    mount(container, sectionScores);

    addDragAndDropHandlers(containerScores, dragStart, dragOver, drop, dragEnd);

    const cachedAccounts = cache.scores;
    if (cachedAccounts && isCacheValid("scores")) {
      this.updateComponentsBefore();
      this.isLoading = false;
      this.error = null;
      this.updateComponentsAfter(cachedAccounts);
      return;
    }

    try {
      this.updateComponentsBefore();
      const [accounts] = await Promise.all([this.getAccounts(), new Promise((resolve) => setTimeout(resolve, 1000))]);
      if (this.error) {
        this.handleError(container);
        return;
      }
      this.updateComponentsAfter(accounts);
    } catch (error) {
      this.handleError(container, error);
    }
  }

  /**
   * Запрос данных о счетах пользователя.
   *
   * Этот метод выполняет запрос к API для получения информации о счетах пользователя,
   * обновляет кэш и состояние компонента в зависимости от результата запроса.
   *
   * @async
   * @returns {Promise<{ payload: Array<Object> }|{ error: string }|null>} - Возвращает асинхронный промис.
   *   - payload (Array<Object>): Массив объектов, представляющих счета пользователя, если операция была успешной.
   *   - error (string): Сообщение об ошибке, если операция не была успешной.
   */
  async getAccounts() {
    try {
      const response = await getScores(this.token);
      if (response.error) {
        this.accounts = [];
        this.isLoading = false;
        this.error = response.error;
        return response.error;
      } else {
        cache.scores = response.payload;
        cache.lastFetch.scores = Date.now();
        this.accounts = response.payload;
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
   * Этот метод устанавливает состояние загрузки и очищает данные счетов перед получением новых данных.
   *
   * @returns {void} - Не возвращает значение.
   */
  updateComponentsBefore() {
    this.listScore.update([], this.isLoading, null);
  }

  /**
   * Обновление компонента после загрузки данных.
   *
   * Этот метод обновляет состояние компонентов с новыми данными о счетах .
   *
   * @param {Array<string>} accounts - Все доступные валюты.
   * @returns {void} - Не возвращает значение.
   */
  updateComponentsAfter(accounts) {
    this.listScore.update(accounts, this.isLoading, null);
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
    this.listScore.update([], false, this.error);
  }
}
