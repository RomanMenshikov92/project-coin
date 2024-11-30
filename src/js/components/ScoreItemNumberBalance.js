import { el, mount } from "redom";
import { configSkeletonItem } from "../config/configSkeletonItem.js";

/**
 * Класс NumberBalanceScoreItem отвечает за отображение номера счета и его баланса.
 *
 * Этот класс управляет отображением информации о счете, включая номер и баланс.
 *
 * @export
 * @class NumberBalanceScoreItem
 * @typedef {NumberBalanceScoreItem}
 */
export default class NumberBalanceScoreItem {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {string} wrapperClass - CSS класс для стилизации элемента, отображающего номер счета и баланс.
   */
  constructor(wrapperClass) {
    this.wrapperClass = wrapperClass;
    this.account = "";
    this.balance = 0;
    this.error = null;
    this.isLoading = true;
    this.scoresItemNumber = null;
    this.scoresItemBalance = null;
    this.numberSpan = null;
    this.balanceSpan = null;
  }

  /**
   * Рендер элемента с номером счета и балансом.
   *
   * Этот метод создает структуру элемента, включая номер счета и баланс,
   * и монтирует его в указанный контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет смонтирован элемент.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    const scoresItemWrapper = el(`.${this.wrapperClass}__top-wrapper`);

    this.scoresItemNumber = el(
      `h3.title.${this.wrapperClass}__top-wrapper-number`,
      "№",
      (this.numberSpan = el(`span.${this.wrapperClass}__top-wrapper-number-span`, `${this.account}`))
    );
    this.scoresItemBalance = el(
      `h3.title.${this.wrapperClass}__top-wrapper-balance`,
      "Баланс",
      (this.balanceSpan = el(`span.${this.wrapperClass}__top-wrapper-balance-span`, `${this.balance}`)),
      el(`span.${this.wrapperClass}__top-wrapper-balance-span`, "₽")
    );

    mount(scoresItemWrapper, this.scoresItemNumber);
    mount(scoresItemWrapper, this.scoresItemBalance);
    mount(container, scoresItemWrapper);
  }

  /**
   * Обновляет состояние компонента с новыми данными о счете.
   *
   * Этот метод обновляет номер счета, баланс, состояние загрузки и сообщение об ошибке.
   *
   * @param {string} account - Номер счета, который будет отображен.
   * @param {number} balance - Баланс счета, который будет отображен.
   * @param {boolean} isLoading - Флаг, указывающий, происходит ли загрузка данных.
   * @param {string|null} error - Сообщение об ошибке, если она произошла.
   * @returns {void} - Не возвращает значение.
   */
  update(account, balance, isLoading, error) {
    this.account = account;
    this.balance = balance;
    this.isLoading = isLoading;
    this.error = error;

    this.renderNumberBalance(this.account, this.balance);
  }

  /**
   * Рендерит номер счета и баланс на основе текущих данных.
   *
   * Этот метод управляет состоянием отображения, включая загрузку и ошибки.
   *
   * @param {string} account - Номер счета для отображения.
   * @param {number} balance - Баланс для отображения.
   * @returns {void} - Не возвращает значение.
   */
  renderNumberBalance(account, balance) {
    const numberWrapper = this.scoresItemNumber;
    const balanceWrapper = this.scoresItemBalance;
    const numberSpanWrapper = this.numberSpan;
    const balanceSpanWrapper = this.balanceSpan;

    if (this.isLoading && this.error === null) {
      numberWrapper.classList.add("scoreItem__top-wrapper-number--loading", "sm-loading");
      balanceWrapper.classList.add("scoreItem__top-wrapper-balance--loading", "sm-loading");
      numberWrapper.dataset.smConfig = configSkeletonItem;
      balanceWrapper.dataset.smConfig = configSkeletonItem;
      const loadingItemNumberSpan = el("div.scoreItem__top-wrapper-number-load.sm-item-primary");
      const loadingItemBalanceSpan = el("div.scoreItem__top-wrapper-balance-load.sm-item-primary");
      numberWrapper.innerHTML = "";
      balanceWrapper.innerHTML = "";
      mount(numberWrapper, loadingItemNumberSpan);
      mount(balanceWrapper, loadingItemBalanceSpan);
      return;
    } else {
      numberWrapper.classList.remove("scoreItem__top-wrapper-number--loading", "sm-loading");
      balanceWrapper.classList.remove("scoreItem__top-wrapper-balance--loading", "sm-loading");
      delete numberWrapper.dataset.smConfig;
      delete balanceWrapper.dataset.smConfig;
      numberWrapper.querySelector("div.scoreItem__top-wrapper-number-load.sm-item-primary")?.remove();
      balanceWrapper.querySelector("div.scoreItem__top-wrapper-balance-load.sm-item-primary")?.remove();
    }

    if (this.error && !this.isLoading) {
      numberWrapper.classList.add("scoreItem__top-wrapper-number--error");
      balanceWrapper.classList.add("scoreItem__top-wrapper-balance--error");
      const errorItemNumberSpan = el(
        "div.scoreItem__top-wrapper-number-failed.sm-item-primary",
        `Error: ${this.error}`
      );
      const errorItemBalanceSpan = el(
        "div.scoreItem__top-wrapper-balance-failed.sm-item-primary",
        `Error: ${this.error}`
      );
      numberWrapper.innerHTML = "";
      balanceWrapper.innerHTML = "";
      mount(numberWrapper, errorItemNumberSpan);
      mount(balanceWrapper, errorItemBalanceSpan);
      return;
    } else {
      numberWrapper.classList.remove("scoreItem__top-wrapper-number--error");
      numberWrapper.querySelector("div.scoreItem__top-wrapper-number-failed.sm-item-primary")?.remove();
      balanceWrapper.querySelector("div.scoreItem__top-wrapper-balance-failed.sm-item-primary")?.remove();
    }

    numberWrapper.textContent = "№";
    balanceWrapper.textContent = "Баланс";
    numberSpanWrapper.textContent = `${account}`;
    balanceSpanWrapper.textContent = `${balance} ₽`;
    mount(numberWrapper, numberSpanWrapper);
    mount(balanceWrapper, balanceSpanWrapper);
  }
}
