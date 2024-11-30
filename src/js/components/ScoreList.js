import { el, mount } from "redom";
import { getScoresById } from "../api/fetchScore.js";
import { configSkeletonItem } from "../config/configSkeletonItem.js";
import ErrorDisplay from "../components/Error.js";

/**
 * Класс ListScore отвечает за отображение списка счетов пользователя.
 *
 * Этот класс управляет отображением счетов, обработкой ошибок и состоянием загрузки.
 *
 * @export
 * @class ListScore
 * @typedef {ListScore}
 */
export default class ListScore {
  constructor(router, token, listScoresPage) {
    /**
     * Создание экземпляра
     *
     * @constructor
     * @param {Object} router - Объект маршрутизатора для навигации между страницами.
     * @param {string} token - Токен аутентификации пользователя.
     * @param {Object} listScoresPage - Экземпляр класса ScoreListPage, к которому относится список счетов.
     */
    this.router = router;
    this.listScoresPage = listScoresPage;
    this.token = token;
    this.currentAccount = null;
    this.accounts = [];
    this.error = null;
    this.isLoading = true;
    this.errorDisplay = new ErrorDisplay();
    this.scoresList = null;
    this.scoresItem = null;
    this.currentSortCriteria = null;
    this.originalAccounts = [];
  }

  /**
   * Рендер списка счетов.
   *
   * Этот метод создает структуру списка и добавляет его в указанный контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет монтироваться список счетов.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    this.scoresList = el("ul.list-reset.score__bottom-list");
    this.scoresItem = el("li.score__bottom-item");
    mount(this.scoresList, this.scoresItem);
    mount(container, this.scoresList);
  }

  /**
   * Обновление списка счетов.
   *
   * Этот метод обновляет состояние счетов, загрузки и ошибок, а затем перерисовывает список.
   *
   * @param {Array<Object>} accounts - Массив объектов, представляющих счета пользователя.
   * @param {boolean} isLoading - Флаг, указывающий, находится ли приложение в состоянии загрузки.
   * @param {string|null} error - Сообщение об ошибке, если таковая имеется.
   * @returns {void} - Не возвращает значение.
   */
  update(accounts, isLoading, error) {
    this.accounts = accounts;
    this.originalAccounts = [...accounts];
    this.isLoading = isLoading;
    this.error = error;

    this.renderAccounts();
  }

  /**
   * Рендеринг счетов в списке.
   *
   * Этот метод обновляет DOM в зависимости от состояния счетов, загрузки и ошибок.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderAccounts() {
    const list = this.scoresList;
    list.innerHTML = "";

    if (this.accounts && this.accounts.length === 0 && !this.isLoading && this.error === null) {
      list.classList.add("score__bottom-list--emptying");
      const emptyItem = el("li.score__bottom-item-empty", "В данный момент нет ваших счетов");
      list.classList.remove("score__bottom-list--loading", "sm-loading");
      delete list.dataset.smConfig;
      list.innerHTML = "";
      mount(list, emptyItem);
      return;
    } else {
      list.classList.remove("score__bottom-list--emptying");
      list.querySelector("li.score__bottom-item-empty")?.remove();
    }

    if (this.isLoading && this.error === null) {
      list.classList.add("score__bottom-list--loading", "sm-loading");
      list.dataset.smConfig = configSkeletonItem;
      list.innerHTML = "";
      Array.from({ length: 3 }).forEach(() => {
        const loadingItem = el("li.score__bottom-item");
        loadingItem.classList.add("score__bottom-item-load", "sm-item-primary");
        mount(list, loadingItem);
      });
      return;
    } else {
      list.classList.remove("score__bottom-list--loading", "sm-loading");
      delete list.dataset.smConfig;
      const loadingItems = list.querySelectorAll(".score__bottom-item.score__bottom-item-load.sm-item-primary");
      loadingItems.forEach((item) => item.remove());
    }

    if (this.error && !this.isLoading) {
      list.classList.add("score__bottom-list--error");
      const errorItem = el("li.score__bottom-item.score__bottom-item-failed", `Error: ${this.error}`);
      list.innerHTML = "";
      mount(list, errorItem);
      return;
    } else {
      list.classList.remove("score__bottom-list--error");
      list.querySelector("li.score__bottom-item.score__bottom-item-failed")?.remove();
    }

    this.accounts.forEach((account) => {
      const scoresItem = el("li.score__bottom-item");
      const scoresItemWrapper = el(".score__bottom-item-wrapper");
      const scoresItemNumber = el("div.score__bottom-item-number", account.account);
      const scoresItemAmount = el("div.score__bottom-item-amount", `${account.balance} ₽`);
      const lastTransaction =
        account.transactions.length > 0
          ? account.transactions.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
          : null;
      const scoresItemBottom = el("div.score__bottom-item-bottom");
      if (lastTransaction !== null) {
        const scoresItemDate = el("div.score__bottom-item-date", "Последняя транзакция: ");
        const scoresItemDateValue = el(
          "span.score__bottom-item-date-value",
          `${new Date(lastTransaction.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}`
        );
        mount(scoresItemDate, scoresItemDateValue);
        mount(scoresItemBottom, scoresItemDate);
      }
      const scoresItemBtn = el("button.btn-reset.score__bottom-item-btn", "Открыть");
      scoresItemBtn.addEventListener("click", async () => {
        try {
          this.listScoresPage.loader.render(this.listScoresPage.wrapper);
          this.listScoresPage.wrapper.classList.add("wrapper--loading");
          const [scoreId] = await Promise.all([
            this.getAccountById(account.account),
            new Promise((resolve) => setTimeout(resolve, 1000)),
          ]);
          this.router.navigate(`score/${scoreId.account}`);
          this.listScoresPage.loader.remove();
          this.listScoresPage.wrapper.classList.remove("wrapper--loading");
        } catch (error) {
          console.error(error);
          this.errorDisplay.show(container, error.message);
          this.listScoresPage.loader.remove();
          this.listScoresPage.wrapper.classList.remove("wrapper--loading");
        }
      });

      mount(this.scoresList, scoresItem);
      mount(scoresItem, scoresItemWrapper);
      mount(scoresItemWrapper, scoresItemNumber);
      mount(scoresItemWrapper, scoresItemAmount);
      mount(scoresItemWrapper, scoresItemBottom);
      mount(scoresItemBottom, scoresItemBtn);
    });
  }

  /**
   * Сортировка счетов по заданному критерию.
   *
   * Этот метод сортирует массив счетов в зависимости от выбранного критерия и обновляет отображение.
   *
   * @param {string|null} criteria - Критерий сортировки.
   * @returns {void} - Не возвращает значение.
   */
  sortAccounts(criteria) {
    if (!this.accounts || this.accounts.length === 0) return;

    if (criteria === null) {
      this.accounts = [...this.originalAccounts];
      this.currentSortCriteria = null;
    } else {
      this.currentSortCriteria = criteria;

      function getLastTransactionDate(account) {
        if (account.transactions.length === 0) {
          return -Infinity;
        } else {
          return new Date(account.transactions.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date);
        }
      }

      switch (criteria) {
        case "number":
          this.accounts.sort((a, b) => a.account.localeCompare(b.account));
          break;
        case "balance":
          this.accounts.sort((a, b) => a.balance - b.balance);
          break;
        case "transaction":
          this.accounts.sort((a, b) => getLastTransactionDate(a) - getLastTransactionDate(b));
          console.log(this.accounts.sort((a, b) => getLastTransactionDate(a) - getLastTransactionDate(b)));
          break;
        default:
          break;
      }
    }

    this.renderAccounts();
  }

  /**
   * Запрос данных о счете по его идентификатору.
   *
   * Этот метод выполняет запрос к API для получения информации о конкретном счете
   * и обновляет состояние компонента в зависимости от результата запроса.
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
        this.error = response.error;
        return response.error;
      } else {
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
}
