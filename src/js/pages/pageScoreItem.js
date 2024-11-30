import { el, mount } from "redom";
import BtnScoreItem from "../components/ScoreItemBtn.js";
import ScoreItemNumberBalance from "../components/ScoreItemNumberBalance.js";
import ScoreItemTranslation from "../components/ScoreItemTranslation.js";
import ScoreItemChart from "../components/ScoreItemChart.js";
import ScoreItemStory from "../components/ScoreItemStory.js";
import ErrorDisplay from "../components/Error.js";
import { getScoresById } from "../api/fetchScore.js";
import Cookies from "js-cookie";
import Loader from "../components/Loader.js";
import { cache, isCacheValid } from "../config/configCache.js";
import { addDragAndDropHandlers, dragStart, dragOver, drop, dragEnd } from "../utils/dragAndDrop.js";

/**
 * Класс ScoreItemPage отвечает за рендеринг страницы с информацией о конкретном счете пользователя.
 *
 * Этот класс создает и управляет компонентами, связанными с отображением информации о счете,
 * включая баланс, переводы, график и историю операций.
 *
 * @export
 * @class ScoreItemPage
 * @typedef {ScoreItemPage}
 */
export default class ScoreItemPage {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {HTMLElement} wrapper - Элемент-обертка, в который будет монтироваться страница с информацией о счете.
   * @param {Object} router - Объект маршрутизатора для навигации между страницами.
   * @param {string} id - Идентификатор счета, который будет загружен.
   */
  constructor(wrapper, router, id) {
    this.wrapper = wrapper;
    this.router = router;
    this.token = Cookies.get("token");
    this.currentAccount = null;
    this.error = null;
    this.isLoading = true;
    this.scoreItemNumberBalance = new ScoreItemNumberBalance("scoreItem");
    this.btnScoreItem = new BtnScoreItem(this.router, "scoreItem__top-btn", () => {
      this.router.navigate("/score");
    });
    this.scoreItemTranslation = new ScoreItemTranslation(this.token, this);
    this.scoreItemChart = new ScoreItemChart(this.router, "scoreItem", "Динамика баланса", false, false);
    this.scoreItemStory = new ScoreItemStory(this.router, "scoreItem", null, false);
    this.errorDisplay = new ErrorDisplay();
    this.id = id;
    this.loader = new Loader();
    this.sectionScoresItem = null;
  }

  /**
   * Рендер страницы с информацией о счете.
   *
   * Этот метод создает структуру страницы, отображает заголовок и блоки компонентов.
   * Если данные о счете кэшированы и действительны, они будут использованы для отображения.
   * В противном случае будет выполнен запрос на получение данных о счете.
   *
   * @async
   * @param {HTMLElement} container - Контейнер, где будет располагаться блок информации о счете.
   * @returns {Promise<void>} - Не возвращает значение.
   */
  async render(container) {
    this.sectionScoresItem = el("section.scoreItem");
    const containerScoresItem = el("div.container.scoreItem__container");

    const scoresItemDivTop = el("div.scoreItem__top");
    const scoresItemDivBottom = el("div.scoreItem__bottom");

    const scoresItemTitle = el("h2.title.scoreItem__top-title", "Просмотр счёта");

    mount(scoresItemDivTop, scoresItemTitle);
    mount(containerScoresItem, scoresItemDivTop);
    mount(containerScoresItem, scoresItemDivBottom);

    this.btnScoreItem.render(scoresItemDivTop);
    this.scoreItemNumberBalance.render(scoresItemDivTop);
    this.scoreItemTranslation.render(scoresItemDivBottom);
    this.scoreItemChart.render(scoresItemDivBottom);
    this.scoreItemStory.render(scoresItemDivBottom);

    mount(this.sectionScoresItem, containerScoresItem);
    mount(container, this.sectionScoresItem);

    addDragAndDropHandlers(this.sectionScoresItem, dragStart, dragOver, drop, dragEnd);

    const cachedAccountId = cache.scoresId;
    if (cachedAccountId && isCacheValid("scoresId")) {
      this.updateComponentsBefore();
      this.isLoading = false;
      this.error = null;
      this.updateComponentsAfter(cachedAccountId.account, cachedAccountId.balance, cachedAccountId.transactions);
      return;
    }

    try {
      this.updateComponentsBefore();
      const [score] = await Promise.all([
        this.getAccountById(this.id),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      if (this.error) {
        this.handleError(container);
        return;
      }
      this.updateComponentsAfter(score.account, score.balance, score.transactions);
    } catch (error) {
      this.handleError(container, error);
    }
  }

  /**
   * Запрос данных о счете по его идентификатору.
   *
   * Этот метод выполняет запрос к API для получения информации о конкретном счете,
   * обновляет кэш и состояние компонента в зависимости от результата запроса.
   *
   * @async
   * @param {string} id - Идентификатор счета, для которого необходимо получить данные.
   * @returns {Promise<{ payload: Object }|{ error: string }|null>} - Возвращает асинхронный промис.
   *   - payload (Object): Объект, представляющий информацию о счете, если операция была успешной.
   *   - error (string): Сообщение об ошибке, если операция не была успешной.
   */
  async getAccountById(id) {
    try {
      const response = await getScoresById(this.token, id);
      if (response.error) {
        this.currentAccount = null;
        this.isLoading = false;
        return response.error;
      } else {
        cache.scoresId = response.payload;
        cache.lastFetch.scoresId = Date.now();
        this.currentAccount = response.payload;
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
   * Обновление компонентов перед загрузкой данных.
   *
   * Этот метод устанавливает состояние загрузки и очищает данные о счете перед получением новых данных.
   *
   * @returns {void} - Не возвращает значение.
   */
  updateComponentsBefore() {
    this.scoreItemNumberBalance.update("", 0, this.isLoading, null);
    this.scoreItemTranslation.update("", this.isLoading, null);
    this.scoreItemChart.update([], null, this.isLoading, null);
    this.scoreItemStory.update([], null, this.isLoading, null);
  }

  /**
   * Обновление компонентов после загрузки данных.
   *
   * Этот метод обновляет состояние компонентов с новыми данными о счете.
   *
   * @param {string} account - Строка, представляющая информацию о счете.
   * @param {number} balance - Баланс счета.
   * @param {Array<Object>} transactions - Массив транзакций, связанных со счетом.
   * @returns {void} - Не возвращает значение.
   */
  updateComponentsAfter(account, balance, transactions) {
    this.scoreItemNumberBalance.update(account, balance, this.isLoading, null);
    this.scoreItemTranslation.update(account, this.isLoading, null);
    this.scoreItemChart.update(transactions, account, this.isLoading, null);
    this.scoreItemStory.update(transactions, account, this.isLoading, null);
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
    this.scoreItemNumberBalance.update("", 0, false, this.error);
    this.scoreItemTranslation.update("", false, this.error);
    this.scoreItemChart.update([], null, false, this.error);
    this.scoreItemStory.update([], null, false, this.error);
  }
}
