import { el, mount } from "redom";
import Cookies from "js-cookie";
import BtnScoreItem from "../components/ScoreItemBtn.js";
import ScoreItemNumberBalance from "../components/ScoreItemNumberBalance.js";
import { getScoresById } from "../api/fetchScore.js";
import ErrorDisplay from "../components/Error.js";
import ScoreItemChart from "../components/ScoreItemChart.js";
import ScoreItemStory from "../components/ScoreItemStory.js";
import { cache, isCacheValid } from "../config/configCache.js";
import { addDragAndDropHandlers, dragStart, dragOver, drop, dragEnd } from "../utils/dragAndDrop.js";

/**
 * Класс ScoreItemHistoryPage отвечает за рендеринг страницы с историей баланса конкретного счета пользователя.
 *
 * Этот класс создает и управляет компонентами, связанными с отображением истории баланса,
 * включая баланс, графики и историю операций.
 *
 * @export
 * @class ScoreItemHistoryPage
 * @typedef {ScoreItemHistoryPage}
 */
export default class ScoreItemHistoryPage {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {HTMLElement} wrapper - Элемент-обертка, в который будет монтироваться страница с историей баланса.
   * @param {Object} router - Объект маршрутизатора для навигации между страницами.
   * @param {string} id - Идентификатор счета, для которого будет загружена история.
   */
  constructor(wrapper, router, id) {
    this.wrapper = wrapper;
    this.router = router;
    this.id = id;
    this.currentAccount = null;
    this.error = null;
    this.isLoading = true;
    this.token = Cookies.get("token");
    this.scoreHistory = null;
    this.scoreItemHistoryNumberBalance = new ScoreItemNumberBalance("scoreItemHistory");
    this.btnScoreItemHistory = new BtnScoreItem(
      this.router,
      "scoreItemHistory__top-btn",
      this.handleBackButtonClick.bind(this)
    );
    this.errorDisplay = new ErrorDisplay();
    this.scoreItemHistoryChartFull = new ScoreItemChart(
      this.router,
      "scoreItemHistory",
      "Динамика баланса",
      true,
      false
    );
    this.scoreItemHistoryChartRatio = new ScoreItemChart(
      this.router,
      "scoreItemHistory",
      "Соотношение входящих исходящих транзакций",
      false,
      true
    );
    this.scoreItemHistoryStory = new ScoreItemStory(
      this.router,
      "scoreItemHistory",
      "scoreItemHistory__bottom-story--optional",
      true
    );
  }

  /**
   * Рендер страницы с историей баланса.
   *
   * Этот метод создает структуру страницы, отображает заголовок и блоки компонентов.
   * Если данные о счете кэшированы и действительны, они будут использованы для отображения.
   * В противном случае будет выполнен запрос на получение данных о счете.
   *
   * @async
   * @param {HTMLElement} container - Контейнер, где будет располагаться блок истории баланса.
   * @returns {Promise<void>} - Не возвращает значение.
   */
  async render(container) {
    const sectionScoresItemHistory = el("div.scoreItemHistory");
    const containerScoresItemHistory = el("div.container.scoreItemHistory__container");

    const scoresItemHistoryDivTop = el("div.scoreItemHistory__top");
    const scoresItemHistoryDivBottom = el("div.scoreItemHistory__bottom");

    const scoresItemHistoryTitle = el("h2.title.scoreItemHistory__top-title", "История баланса");

    mount(scoresItemHistoryDivTop, scoresItemHistoryTitle);
    mount(containerScoresItemHistory, scoresItemHistoryDivTop);
    mount(containerScoresItemHistory, scoresItemHistoryDivBottom);

    this.btnScoreItemHistory.render(scoresItemHistoryDivTop);
    this.scoreItemHistoryNumberBalance.render(scoresItemHistoryDivTop);
    this.scoreItemHistoryChartFull.render(scoresItemHistoryDivBottom);
    this.scoreItemHistoryChartRatio.render(scoresItemHistoryDivBottom);
    this.scoreItemHistoryStory.render(scoresItemHistoryDivBottom);

    mount(sectionScoresItemHistory, containerScoresItemHistory);
    mount(container, sectionScoresItemHistory);

    addDragAndDropHandlers(sectionScoresItemHistory, dragStart, dragOver, drop, dragEnd);

    const cachedAccountId = cache.scoresId;
    if (cachedAccountId && isCacheValid("scoresId")) {
      this.updateComponentsBefore();
      this.isLoading = false;
      this.error = null;
      this.scoreHistory = cachedAccountId;
      this.updateComponentsAfter(cachedAccountId.account, cachedAccountId.balance, cachedAccountId.transactions);
      return;
    }

    try {
      this.updateComponentsBefore();
      const [scoreHistory] = await Promise.all([
        this.getAccountById(this.id),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      if (this.error) {
        this.handleError(container);
        return;
      }
      this.scoreHistory = scoreHistory;
      this.updateComponentsAfter(scoreHistory.account, scoreHistory.balance, scoreHistory.transactions);
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
   * Обработка нажатия кнопки "Назад".
   *
   * Этот метод отвечает за навигацию обратно на страницу с информацией о счете,
   * если данные о счете доступны.
   *
   * @returns {void} - Не возвращает значение.
   */
  handleBackButtonClick() {
    if (this.scoreHistory) {
      this.router.navigate(`score/${this.scoreHistory.account}`);
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
    this.scoreItemHistoryNumberBalance.update("", 0, this.isLoading, null);
    this.scoreItemHistoryChartFull.update([], null, this.isLoading, null);
    this.scoreItemHistoryChartRatio.update([], null, this.isLoading, null);
    this.scoreItemHistoryStory.update([], null, this.isLoading, null);
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
    this.scoreItemHistoryNumberBalance.update(account, balance, this.isLoading, null);
    this.scoreItemHistoryChartFull.update(transactions, account, this.isLoading, null);
    this.scoreItemHistoryChartRatio.update(transactions, account, this.isLoading, null);
    this.scoreItemHistoryStory.update(transactions, account, this.isLoading, null);
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
    this.scoreItemHistoryNumberBalance.update("", 0, false, this.error);
    this.scoreItemHistoryChartFull.update([], null, this.isLoading, null);
    this.scoreItemHistoryChartRatio.update([], null, this.isLoading, null);
    this.scoreItemHistoryStory.update([], null, this.isLoading, null);
  }
}
