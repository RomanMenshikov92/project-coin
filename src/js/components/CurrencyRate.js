import { el, mount } from "redom";
import { configSkeletonItem } from "../config/configSkeletonItem.js";
import ErrorDisplay from "../components/Error.js";
import IconInButton from "./Icons.js";

/**
 * Класс DivCurrencyRate отвечает за отображение курсов валют в реальном времени.
 *
 * Этот класс создает интерфейс для отображения изменений курсов валют
 * и управляет логикой обновления данных о курсах.
 *
 * @export
 * @class DivCurrencyRate
 * @typedef {DivCurrencyRate}
 */
export default class DivCurrencyRate {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {string} token - Токен аутентификации пользователя.
   * @param {Object} currenciesPage - Экземпляр класса CurrencyPage, к которому относится блок курсов валют.
   */
  constructor(token, currenciesPage) {
    this.currenciesPage = currenciesPage;
    this.token = token;
    this.error = null;
    this.isLoading = true;
    this.errorDisplay = new ErrorDisplay();
    this.currencyRateWrapper = null;
    this.currencyRateTitle = null;
    this.currencyRateList = null;
    this.currencyRates = {};
  }

  /**
   * Рендер блока курсов валют.
   *
   * Этот метод создает структуру блока курсов валют и добавляет его в указанный контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет монтироваться блок курсов валют.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    this.currencyRateWrapper = el(".currency__rate");
    this.currencyRateWrapper.id = "currencyRate";
    this.currencyRateWrapper.setAttribute("draggable", "true");

    this.currencyRateTitle = el("h3.title.currency__rate-title", "Изменение курсов в реальном времени");

    this.currencyRateList = el("ul.list-reset.currency__rate-list");

    mount(this.currencyRateWrapper, this.currencyRateTitle);
    mount(this.currencyRateWrapper, this.currencyRateList);

    mount(container, this.currencyRateWrapper);
  }

  /**
   * Обновление состояния компонента с новыми данными.
   *
   * Этот метод обновляет данные о курсах валют, статус загрузки и ошибки.
   *
   * @param {Object<Object>} currencyRates - Объект с курсами валют.
   * @param {boolean} isLoading - Статус загрузки данных.
   * @param {string|null} error - Сообщение об ошибке, если есть.
   * @returns {void} - Не возвращает значение.
   */
  update(currencyRates, isLoading, error) {
    this.currencyRates = currencyRates || {};
    this.isLoading = isLoading;
    this.error = error;
    this.renderRate();
  }

  /**
   * Рендеринг курсов валют в интерфейсе.
   *
   * Этот метод обновляет DOM в зависимости от состояния курсов и ошибок.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderRate() {
    const item = this.currencyRateWrapper;
    const title = this.currencyRateTitle;
    const list = this.currencyRateList;
    list.innerHTML = "";

    const currencyPairs = Object.keys(this.currencyRates || {});

    if (currencyPairs.length >= 12) {
      const oldestPair = currencyPairs[0];
      delete this.currencyRates[oldestPair];
    }

    const hasCurrencies = currencyPairs && typeof currencyPairs === "object" && Object.keys(currencyPairs).length > 0;

    if (!hasCurrencies && !this.isLoading && this.error === null) {
      item.classList.add("currency__rate--emptying");
      const emptyItem = el("div.currency__rate-empty", "Отсутствуют данные");
      delete item.dataset.smConfig;
      item.innerHTML = "";
      mount(item, emptyItem);
      return;
    } else {
      item.classList.remove("currency__rate--emptying");
      item.querySelector("div.currency__rate-empty")?.remove();
    }

    if (this.isLoading && this.error === null) {
      item.classList.add("currency__rate--loading", "sm-loading");
      item.dataset.smConfig = configSkeletonItem;
      const loadingItem = el("div.currency__rate-load.sm-item-primary");
      item.innerHTML = "";
      mount(item, loadingItem);
      return;
    } else {
      item.classList.remove("currency__rate--loading", "sm-loading");
      delete item.dataset.smConfig;
      item.querySelector(`div.currency__rate-load.sm-item-primary`)?.remove();
    }

    if (this.error && !this.isLoading) {
      item.classList.add("currency__rate--error");
      const errorItem = el("div.currency__rate-failed", `Error: ${this.error}`);
      item.innerHTML = "";
      mount(item, errorItem);
      return;
    } else {
      item.classList.remove("currency__rate--error");
      item.querySelector("div.currency__rate-failed")?.remove();
    }

    for (const pair in this.currencyRates) {
      const { from, to, rate, change } = this.currencyRates[pair];
      const arrowClass =
        change === 1
          ? "currency__rate-item-number-icon-svg--up"
          : change === -1
            ? "currency__rate-item-number-icon-svg--down"
            : "";
      const itemClass = change === 1 ? "currency__rate-item--up" : change === -1 ? "currency__rate-item--down" : "";

      const listItem = el(`li.currency__rate-item ${itemClass}`);

      const rateTextPair = el("span.currency__rate-item-pair", `${from}/${to}`);
      const rateTextNumber = el("span.currency__rate-item-number", `${rate}`, [
        el("span.currency__rate-item-number-icon"),
      ]);

      const iconArrowRate = new IconInButton(
        null,
        rateTextNumber.querySelector(".currency__rate-item-number-icon"),
        null,
        null,
        null,
        `currency__rate-item-number-icon-svg ${arrowClass}`
      );
      iconArrowRate.renderArrowIcon();

      mount(listItem, rateTextPair);
      mount(listItem, rateTextNumber);
      mount(list, listItem);
    }

    if (this.error === null && !this.isLoading) {
      mount(item, title);
      mount(item, list);
    }
  }

  /**
   * Обновление курса валют по заданной паре.
   *
   * Этот метод обновляет курс валюты и перерисовывает список курсов.
   *
   * @param {string} from - Код валюты, из которой происходит обмен.
   * @param {string} to - Код валюты, в которую происходит обмен.
   * @param {number} rate - Обновленный курс обмена.
   * @param {number} change - Изменение курса обмена.
   * @returns {void} - Не возвращает значение.
   */
  updateCurrencyRate(from, to, rate, change) {
    const pair = `${from}/${to}`;
    this.currencyRates[pair] = { rate, change };
    this.renderRate();
  }
}
