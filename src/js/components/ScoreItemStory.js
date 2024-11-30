import { el, mount } from "redom";
import { configSkeletonItem } from "../config/configSkeletonItem.js";

/**
 * Класс ScoreItemStory отвечает за отображение истории переводов для конкретного счета.
 *
 * Этот класс управляет отображением информации о переводах, включая отображение таблицы
 * с деталями переводов.
 *
 * @export
 * @class ScoreItemStory
 * @typedef {ScoreItemStory}
 */
export default class ScoreItemStory {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {Object} router - Объект маршрутизатора для навигации между страницами.
   * @param {string} className - Основной CSS класс для стилизации компонента.
   * @param {string|null} [classNameOptional=null] - Дополнительный CSS класс для стилизации компонента (по умолчанию null).
   * @param {boolean} [lengthOutput=false] - Флаг, указывающий, отображать ли 6(или 25) по количеству (по умолчанию false).
   */
  constructor(router, className, classNameOptional = null, lengthOutput = false) {
    this.router = router;
    this.transactions = [];
    this.error = null;
    this.isLoading = true;
    this.scoresItemStory = null;
    this.scoresItemStoryTitle = null;
    this.scoresItemStoryTable = null;
    this.scoresItemStoryTableBody = null;
    this.scoresItemStoryTableBodyTr = null;
    this.classNameOptional = classNameOptional;
    this.className = className;
    this.lengthOutput = lengthOutput;
  }

  /**
   * Рендерит элемент истории переводов.
   *
   * Этот метод создает структуру элемента, включая заголовок и таблицу с переводами,
   * и монтирует его в указанный контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет смонтирован элемент истории переводов.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    this.scoresItemStory = el(
      `div.${this.className}__bottom-story${this.classNameOptional ? `.${this.classNameOptional}` : ""}`
    );
    this.scoresItemStory.id = "scoreItemStory";
    this.scoresItemStory.setAttribute("draggable", "true");

    this.scoresItemStory.addEventListener("click", this.handleNavigate.bind(this));
    this.scoresItemStoryTitle = el(`h3.title.${this.className}__bottom-story-title`, "История переводов");

    this.scoresItemStoryTable = el(`table.${this.className}__bottom-story-table`);
    const scoresItemStoryTableHead = el(`thead.${this.className}__bottom-story-table-head`);
    const scoresItemStoryTableHeadTr = el(`tr.${this.className}__bottom-story-table-head-tr`);
    const scoresItemStoryTableHeadThFrom = el(`th.${this.className}__bottom-story-table-head-th`, "Счёт отправителя");
    const scoresItemStoryTableHeadThTo = el(`th.${this.className}__bottom-story-table-head-th`, "Счёт получателя");
    const scoresItemStoryTableHeadThAmount = el(`th.${this.className}__bottom-story-table-head-th`, "Сумма");
    const scoresItemStoryTableHeadThDate = el(`th.${this.className}__bottom-story-table-head-th`, "Дата");

    this.scoresItemStoryTableBody = el(
      `tbody.${this.className}__bottom-story-table-body`,
      (this.scoresItemStoryTableBodyTr = el("tr"))
    );

    mount(scoresItemStoryTableHead, scoresItemStoryTableHeadTr);

    mount(scoresItemStoryTableHeadTr, scoresItemStoryTableHeadThFrom);
    mount(scoresItemStoryTableHeadTr, scoresItemStoryTableHeadThTo);
    mount(scoresItemStoryTableHeadTr, scoresItemStoryTableHeadThAmount);
    mount(scoresItemStoryTableHeadTr, scoresItemStoryTableHeadThDate);

    mount(this.scoresItemStoryTable, scoresItemStoryTableHead);
    mount(this.scoresItemStoryTable, this.scoresItemStoryTableBody);
    mount(this.scoresItemStory, this.scoresItemStoryTitle);
    mount(this.scoresItemStory, this.scoresItemStoryTable);
    mount(container, this.scoresItemStory);
  }

  /**
   * Обновляет состояние компонента с новыми данными о транзакциях.
   *
   * Этот метод обновляет массив транзакций, состояние загрузки и сообщение об ошибке.
   *
   * @param {Array<Object>} transactions - Массив транзакций, связанных со счетом.
   * @param {string} currentAccount - Номер текущего счета.
   * @param {boolean} isLoading - Флаг, указывающий, происходит ли загрузка данных.
   * @param {string|null} error - Сообщение об ошибке, если она произошла.
   * @returns {void} - Не возвращает значение.
   */
  update(transactions, currentAccount, isLoading, error) {
    this.currentAccount = currentAccount;
    this.transactions = transactions;
    this.isLoading = isLoading;
    this.error = error;

    this.renderTransactions(this.currentAccount);
  }

  /**
   * Рендерит транзакции на основе текущих данных.
   *
   * Этот метод обновляет таблицу с транзакциями, обрабатывает состояния загрузки, ошибок и отсутствия данных.
   *
   * @param {string} currentAccount - Номер текущего счета для фильтрации транзакций.
   * @returns {void} - Не возвращает значение.
   */
  renderTransactions(currentAccount) {
    const item = this.scoresItemStory;
    const title = this.scoresItemStoryTitle;
    const table = this.scoresItemStoryTable;
    const tbody = this.scoresItemStoryTableBody;

    const relevantTransactions = this.transactions.filter(
      (transaction) => transaction.from === currentAccount || transaction.to === currentAccount
    );
    relevantTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    let recentTransactions = !this.lengthOutput ? relevantTransactions.slice(0, 10) : relevantTransactions.slice(0, 25);

    tbody.innerHTML = "";

    if (this.transactions && this.transactions.length === 0 && !this.isLoading && this.error === null) {
      item.classList.add(`${this.className}__bottom-story--emptying`);
      const emptyItem = el(`div.${this.className}__bottom-story-empty`, "В данный момент пустая история переводов");
      item.classList.remove(`${this.className}__bottom-story--loading`, "sm-loading");
      delete item.dataset.smConfig;
      item.innerHTML = "";
      mount(item, emptyItem);
      return;
    } else {
      item.classList.remove(`${this.className}__bottom-story--emptying`);
      item.querySelector(`div.${this.className}__bottom-story-empty`)?.remove();
    }

    if (this.isLoading && this.error === null) {
      item.classList.add(`${this.className}__bottom-story--loading`, "sm-loading");
      item.dataset.smConfig = configSkeletonItem;
      const loadingItem = el(`div.${this.className}__bottom-story-load.sm-item-primary`);
      item.innerHTML = "";
      mount(item, loadingItem);
      return;
    } else {
      item.classList.remove(`${this.className}__bottom-story--loading`, "sm-loading");
      delete item.dataset.smConfig;
      item.querySelector(`div.${this.className}__bottom-story-load.sm-item-primary`)?.remove();
    }

    if (this.error && !this.isLoading) {
      item.classList.add(`${this.className}__bottom-story--error`);
      const errorItem = el(`div.${this.className}__bottom-story-failed`, `Error: ${this.error}`);
      item.innerHTML = "";
      mount(item, errorItem);
      return;
    } else {
      item.classList.remove(`${this.className}__bottom-story--error`);
      item.querySelector(`div.${this.className}__bottom-story-failed`)?.remove();
    }

    recentTransactions.forEach((transaction) => {
      const tr = el(`tr.${this.className}__bottom-story-table-body-tr`);
      const tdFrom = el(`td.${this.className}__bottom-story-table-body-td`, transaction.from);
      const tdTo = el(`td.${this.className}__bottom-story-table-body-td`, transaction.to);
      const amountSign = transaction.from === currentAccount ? "-" : "+";
      const amountColor = transaction.from === currentAccount ? "red" : "green";
      const tdAmount = el(`td.${this.className}__bottom-story-table-body-td`, {
        style: { color: amountColor },
        textContent: `${amountSign} ${Math.abs(transaction.amount)}`,
      });

      const formattedDate = new Date(transaction.date).toLocaleDateString("ru-RU");
      const tdDate = el(`td.${this.className}__bottom-story-table-body-td`, formattedDate);

      mount(tr, tdFrom);
      mount(tr, tdTo);
      mount(tr, tdAmount);
      mount(tr, tdDate);
      mount(tbody, tr);
    });

    mount(item, title);
    mount(item, table);
  }

  /**
   * Обрабатывает навигацию по клику на элемент истории переводов.
   *
   * Этот метод отвечает за переход на страницу с деталями выбранного перевода.
   *
   * @returns {void} - Не возвращает значение.
   */
  handleNavigate() {
    this.router.navigate(`score/${this.currentAccount}/history`);
  }
}
