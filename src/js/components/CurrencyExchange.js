import { el, mount } from "redom";
import { configSkeletonItem } from "../config/configSkeletonItem.js";
import { postCurrencyBuy } from "../api/fetchCurrency.js";
import ErrorDisplay from "../components/Error.js";
import IconInButton from "./Icons.js";

/**
 * Класс DivCurrencyExchange отвечает за обработку и отображение формы обмена валюты.
 *
 * Этот класс создает интерфейс для обмена валюты и управляет логикой обмена.
 *
 * @export
 * @class DivCurrencyExchange
 * @typedef {DivCurrencyExchange}
 */
export default class DivCurrencyExchange {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {string} token - Токен аутентификации пользователя.
   * @param {Object} currenciesPage - Экземпляр класса CurrencyPage, к которому относится блок формы обмена валюты.
   */
  constructor(token, currenciesPage) {
    this.currenciesPage = currenciesPage;
    this.token = token;
    this.allCurrencies = [];
    this.yoursCurrencies = {};
    this.error = null;
    this.isLoading = true;
    this.dataCurrencies = null;
    this.errorDisplay = new ErrorDisplay();
    this.currencyExchangeWrapper = null;
    this.currencyExchangeTitle = null;
    this.currencyExchangeForm = null;
    this.currencyExchangeLabelFirst = null;
    this.currencyExchangeLabelSecond = null;
    this.currencyExchangeLabelThird = null;
    this.currencyExchangeSelectFirst = null;
    this.currencyExchangeSelectSecond = null;
    this.currencyExchangeInputThird = null;
    this.currencyExchangeLabelWrapper = null;
  }

  /**
   * Рендер формы обмена валюты.
   *
   * Этот метод создает структуру формы обмена валюты и добавляет ее в указанный контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет монтироваться форма обмена валюты.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    this.currencyExchangeWrapper = el(".currency__exchange");
    this.currencyExchangeWrapper.id = "currencyExchange";
    this.currencyExchangeWrapper.setAttribute("draggable", "true");
    this.currencyExchangeTitle = el("h3.title.currency__exchange-title", "Обмен валюты");
    this.currencyExchangeForm = el("form.currency__exchange-form", {
      id: "exchange-currency",
      action: "/",
      method: "POST",
      "aria-label": "Форма обмена валюты",
      autocomplete: "on",
    });
    const currencyExchangeFormLeft = el(".currency__exchange-form-left");

    this.currencyExchangeLabelWrapper = el(".currency__exchange-wrapper-label");

    this.currencyExchangeLabelFirst = el(
      ".currency__exchange-label.currency__exchange-label--select",
      el("span.currency__exchange-label-text", "Из")
    );

    this.currencyExchangeLabelSecond = el(
      ".currency__exchange-label.currency__exchange-label--select",
      el("span.currency__exchange-label-text", "в")
    );

    this.currencyExchangeLabelThird = el(
      "label.currency__exchange-label.currency__exchange-label--input",
      { for: "amount" },
      el("span.currency__exchange-label-text", "Сумма")
    );

    const currencyExchangeCustomSelectFirst = el(".currency__exchange-label-custom");
    const currencyExchangeCustomSelectSecond = el(".currency__exchange-label-custom");

    this.currencyExchangeSelectFirst = el(
      ".currency__exchange-label-custom-select",
      {
        id: "firstType",
        "aria-label": "Выберите из списка подходящую валюту",
      },
      [
        el("span.currency__exchange-label-custom-select-main-option", { "data-code": null }),
        el("span.currency__exchange-label-custom-select-main-icon"),
      ]
    );
    this.currencyExchangeSelectSecond = el(
      ".currency__exchange-label-custom-select",
      {
        id: "secondType",
        "aria-label": "Выберите из списка подходящую валюту",
      },
      [
        el("span.currency__exchange-label-custom-select-main-option", { "data-code": null }),
        el("span.currency__exchange-label-custom-select-main-icon"),
      ]
    );
    const iconArrowSelectFirst = new IconInButton(
      null,
      this.currencyExchangeSelectFirst.querySelector(".currency__exchange-label-custom-select-main-icon"),
      null,
      null,
      null,
      "currency__exchange-label-custom-select-main-icon-svg"
    );
    iconArrowSelectFirst.renderArrowIcon();
    const iconArrowSelectSecond = new IconInButton(
      null,
      this.currencyExchangeSelectSecond.querySelector(".currency__exchange-label-custom-select-main-icon"),
      null,
      null,
      null,
      "currency__exchange-label-custom-select-main-icon-svg"
    );
    iconArrowSelectSecond.renderArrowIcon();
    this.optionsListFirst = el("ul.list-reset.currency__exchange-label-custom-select-options", {
      id: "optionsListFirst",
    });
    this.optionsListSecond = el("ul.list-reset.currency__exchange-label-custom-select-options", {
      id: "optionsListSecond",
    });

    this.currencyExchangeInputThird = el("input.input-reset.currency__exchange-input", {
      id: "amount",
      type: "number",
      name: "amount",
      "aria-label": "Введите сумму",
      placeholder: "",
      min: "0",
      required: true,
      autocomplete: "off",
    });

    const currencyExchangeBtn = el(
      "button.btn-reset.currency__exchange-btn",
      { id: "btnExchangeCurrency", type: "submit" },
      "Обменять"
    );

    currencyExchangeBtn.addEventListener("click", this.handleSwapClick.bind(this));

    mount(this.currencyExchangeWrapper, this.currencyExchangeTitle);
    mount(this.currencyExchangeWrapper, this.currencyExchangeForm);
    mount(this.currencyExchangeForm, currencyExchangeFormLeft);
    mount(this.currencyExchangeForm, currencyExchangeBtn);
    mount(currencyExchangeFormLeft, this.currencyExchangeLabelWrapper);
    mount(currencyExchangeFormLeft, this.currencyExchangeLabelThird);
    mount(this.currencyExchangeLabelWrapper, this.currencyExchangeLabelFirst);
    mount(this.currencyExchangeLabelWrapper, this.currencyExchangeLabelSecond);
    mount(this.currencyExchangeLabelFirst, currencyExchangeCustomSelectFirst);
    mount(this.currencyExchangeLabelSecond, currencyExchangeCustomSelectSecond);
    mount(currencyExchangeCustomSelectFirst, this.currencyExchangeSelectFirst);
    mount(currencyExchangeCustomSelectSecond, this.currencyExchangeSelectSecond);
    mount(currencyExchangeCustomSelectFirst, this.optionsListFirst);
    mount(currencyExchangeCustomSelectSecond, this.optionsListSecond);
    mount(this.currencyExchangeLabelThird, this.currencyExchangeInputThird);

    mount(container, this.currencyExchangeWrapper);

    setTimeout(() => {
      this.initCustomSelect();
    }, 100);
  }

  /**
   * Обновление состояния компонента с новыми данными.
   *
   * Этот метод обновляет данные о валютах, статус загрузки и ошибки.
   *
   * @param {Array<string>} allCurrencies - Все доступные валюты.
   * @param {Object<Object>} yoursCurrencies - Валюты пользователя.
   * @param {boolean} isLoading - Статус загрузки данных.
   * @param {string|null} error - Сообщение об ошибке, если есть.
   * @returns {void} - Не возвращает значение.
   */
  update(allCurrencies, yoursCurrencies, isLoading, error) {
    this.allCurrencies = allCurrencies;
    this.yoursCurrencies = yoursCurrencies;
    this.isLoading = isLoading;
    this.error = error;
    this.renderCurrency();
  }

  /**
   * Рендеринг валют в интерфейсе.
   *
   * Этот метод обновляет DOM в зависимости от состояния валют и ошибок.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderCurrency() {
    const item = this.currencyExchangeWrapper;
    const title = this.currencyExchangeTitle;
    const form = this.currencyExchangeForm;

    const hasCurrencies =
      this.yoursCurrencies && typeof this.yoursCurrencies === "object" && Object.keys(this.yoursCurrencies).length > 0;
    const hasAllCurrencies = this.allCurrencies && Array.isArray(this.allCurrencies) && this.allCurrencies.length > 0;

    if ((!hasCurrencies || !hasAllCurrencies) && !this.isLoading && this.error === null) {
      item.classList.add("currency__exchange--emptying");
      const emptyItem = el("div.currency__exchange-empty", "В данный момент у вас нет валютных счетов");
      delete item.dataset.smConfig;
      item.innerHTML = "";
      mount(item, emptyItem);
      return;
    } else {
      item.classList.remove("currency__exchange--emptying");
      item.querySelector("div.currency__exchange-empty")?.remove();
    }

    if (this.isLoading && this.error === null) {
      item.classList.add("currency__exchange--loading", "sm-loading");
      item.dataset.smConfig = configSkeletonItem;
      const loadingItem = el("div.currency__exchange-load.sm-item-primary");
      item.innerHTML = "";
      mount(item, loadingItem);
      return;
    } else {
      item.classList.remove("currency__exchange--loading", "sm-loading");
      delete item.dataset.smConfig;
      item.querySelector(`div.currency__exchange-load.sm-item-primary`)?.remove();
    }

    if (this.error && !this.isLoading) {
      item.classList.add("currency__exchange--error");
      const errorItem = el("div.currency__exchange-failed", `Error: ${this.error}`);
      item.innerHTML = "";
      mount(item, errorItem);
      return;
    } else {
      item.classList.remove("currency__exchange--error");
      item.querySelector("div.currency__exchange-failed")?.remove();
    }

    this.updateCurrencyOptions();

    if (this.error === null && !this.isLoading) {
      mount(item, title);
      mount(item, form);
    }
  }

  /**
   * Обновление списка доступных валют для выбора.
   *
   * Этот метод обновляет опции выбора валют в интерфейсе.
   *
   * @returns {void} - Не возвращает значение.
   */
  updateCurrencyOptions() {
    this.optionsListFirst.innerHTML = "";
    this.optionsListSecond.innerHTML = "";

    const firstCurrency = Object.keys(this.yoursCurrencies)[0] || null;
    const secondCurrency = this.allCurrencies[0] || null;

    const mainOptionFirst = this.currencyExchangeSelectFirst.querySelector(
      ".currency__exchange-label-custom-select-main-option"
    );
    mainOptionFirst.textContent = firstCurrency;
    mainOptionFirst.setAttribute("data-code", firstCurrency);

    const mainOptionSecond = this.currencyExchangeSelectSecond.querySelector(
      ".currency__exchange-label-custom-select-main-option"
    );
    mainOptionSecond.textContent = secondCurrency;
    mainOptionSecond.setAttribute("data-code", secondCurrency);

    for (const currencyCode in this.yoursCurrencies) {
      const currencyData = this.yoursCurrencies[currencyCode];
      const amount = currencyData.amount;
      const code = currencyData.code;
      const li = el("li.currency__exchange-label-custom-select-options-item", {
        textContent: code,
        onclick: () => this.selectCurrencyFirst(code, amount),
      });
      mount(this.optionsListFirst, li);
    }

    this.allCurrencies.forEach((currency) => {
      const li = el("li.currency__exchange-label-custom-select-options-item", {
        textContent: currency,
        onclick: () => this.selectCurrencySecond(currency),
      });
      mount(this.optionsListSecond, li);
    });
  }

  /**
   * Инициализация пользовательского выбора валюты.
   *
   * Этот метод добавляет обработчики событий для пользовательских селекторов валюты.
   *
   * @returns {void} - Не возвращает значение.
   */
  initCustomSelect() {
    this.currencyExchangeSelectFirst.addEventListener("click", () => {
      const icon = this.currencyExchangeSelectFirst.querySelector(".currency__exchange-label-custom-select-main-icon");
      const isOpen = this.optionsListFirst.classList.toggle("currency__exchange-label-custom-select-options--show");

      if (isOpen) {
        this.optionsListSecond.classList.remove("currency__exchange-label-custom-select-options--show");
        this.currencyExchangeSelectSecond
          .querySelector(".currency__exchange-label-custom-select-main-icon")
          .classList.remove("currency__exchange-label-custom-select-main-icon--rotate");
      }

      icon.classList.toggle("currency__exchange-label-custom-select-main-icon--rotate");
    });

    this.currencyExchangeSelectSecond.addEventListener("click", () => {
      const icon = this.currencyExchangeSelectSecond.querySelector(".currency__exchange-label-custom-select-main-icon");
      const isOpen = this.optionsListSecond.classList.toggle("currency__exchange-label-custom-select-options--show");

      if (isOpen) {
        this.optionsListFirst.classList.remove("currency__exchange-label-custom-select-options--show");
        this.currencyExchangeSelectFirst
          .querySelector(".currency__exchange-label-custom-select-main-icon")
          .classList.remove("currency__exchange-label-custom-select-main-icon--rotate");
      }

      icon.classList.toggle("currency__exchange-label-custom-select-main-icon--rotate");
    });
  }

  /**
   * Обработка клика на первую валюту.
   *
   * Этот метод обновляет выбранную валюту и закрывает список опций.
   *
   * @param {string} currencyCode - Код выбранной валюты.
   * @param {number} currencyAmount - Сумма выбранной валюты.
   * @returns {void} - Не возвращает значение.
   */
  selectCurrencyFirst(currencyCode, currencyAmount) {
    const mainOption = this.currencyExchangeSelectFirst.querySelector(
      ".currency__exchange-label-custom-select-main-option"
    );
    mainOption.textContent = currencyCode;
    mainOption.setAttribute("data-code", currencyCode);
    this.optionsListFirst.classList.remove("currency__exchange-label-custom-select-options--show");

    const icon = this.currencyExchangeSelectFirst.querySelector(".currency__exchange-label-custom-select-main-icon");
    icon.classList.remove("currency__exchange-label-custom-select-main-icon--rotate");
  }

  /**
   * Обработка клика на вторую валюту.
   *
   * Этот метод обновляет выбранную валюту и закрывает список опций.
   *
   * @param {string} currencyCode - Код выбранной валюты.
   * @returns {void} - Не возвращает значение.
   */
  selectCurrencySecond(currencyCode) {
    const mainOption = this.currencyExchangeSelectSecond.querySelector(
      ".currency__exchange-label-custom-select-main-option"
    );
    mainOption.textContent = currencyCode;
    mainOption.setAttribute("data-code", currencyCode);
    this.optionsListSecond.classList.remove("currency__exchange-label-custom-select-options--show");

    const icon = this.currencyExchangeSelectSecond.querySelector(".currency__exchange-label-custom-select-main-icon");
    icon.classList.remove("currency__exchange-label-custom-select-main-icon--rotate");
  }

  /**
   * Очистка сообщений об ошибках.
   *
   * Этот метод удаляет сообщения об ошибках из формы.
   *
   * @returns {void} - Не возвращает значение.
   */
  clearErrorMessages() {
    this.currencyExchangeLabelThird.querySelector(".currency__exchange-form-error-amount")?.remove();
    this.currencyExchangeForm.querySelector(".currency__exchange-form-error")?.remove();
  }

  /**
   * Обработка клика на кнопку обмена валюты.
   *
   * Этот метод выполняет проверку введенных данных и отправляет запрос на обмен валюты.
   *
   * @async
   * @param {MouseEvent} e - Событие клика на кнопку.
   * @returns {Promise<boolean>} - Возвращает промис, который разрешается в true, если обмен успешен, или false в противном случае.
   */
  async handleSwapClick(e) {
    e.preventDefault();
    const firstCurrency = this.currencyExchangeSelectFirst
      .querySelector(".currency__exchange-label-custom-select-main-option")
      .getAttribute("data-code");
    const secondCurrency = this.currencyExchangeSelectSecond
      .querySelector(".currency__exchange-label-custom-select-main-option")
      .getAttribute("data-code");
    const amountCurrency = parseFloat(this.currencyExchangeInputThird.value.trim());
    let errorMessageResponse = el("span.currency__exchange-form-error");
    const errorMessageAmount = el("span.currency__exchange-form-error-amount");
    let isValid = true;

    this.dataCurrencies = {
      from: firstCurrency,
      to: secondCurrency,
      amount: amountCurrency,
    };

    this.clearErrorMessages();

    if (isNaN(amountCurrency) || amountCurrency <= 0) {
      errorMessageAmount.textContent = "Сумма перевода должна быть положительной";
      mount(this.currencyExchangeLabelThird, errorMessageAmount);
      isValid = false;
    } else {
      errorMessageResponse.textContent = "";
      try {
        const [response] = await Promise.all([
          this.postExchange(this.dataCurrencies.from, this.dataCurrencies.to, this.dataCurrencies.amount),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);
        if (response.error) {
          if (response.error === "Unknown currency code") {
            errorMessageResponse.textContent =
              "Передан неверный валютный код, код не поддерживается системой (валютный код списания или валютный код зачисления)";
            mount(this.currencyExchangeForm, errorMessageResponse);
          } else if (response.error === "Invalid amount") {
            errorMessageResponse.textContent = "Не указана сумма перевода, или она отрицательная";
            mount(this.currencyExchangeForm, errorMessageResponse);
          } else if (response.error === "Not enough currency") {
            errorMessageResponse.textContent = "на валютном счёте списания нет средств";
            mount(this.currencyExchangeForm, errorMessageResponse);
          } else if (response.error === "Overdraft prevented") {
            errorMessageResponse.textContent = "Попытка перевести больше, чем доступно на счёте списания.";
            mount(this.currencyExchangeForm, errorMessageResponse);
          } else {
            errorMessageResponse.textContent = response.error;
            mount(this.currencyExchangeForm, errorMessageResponse);
          }
          isValid = false;
        } else {
          this.currencyExchangeInputThird.value = "";

          try {
            this.currenciesPage.loader.render(this.currenciesPage.wrapper);
            this.currenciesPage.wrapper.classList.add("wrapper--loading");

            const [updatedFullCurrencies, updatedThyCurrencies] = await Promise.all([
              this.currenciesPage.getFullCurrencies(),
              this.currenciesPage.getThyCurrencies(),
              new Promise((resolve) => setTimeout(resolve, 1000)),
            ]);
            this.currenciesPage.updateComponentsAfter(updatedFullCurrencies, updatedThyCurrencies);
          } catch (error) {
            this.handleError(this.currencyExchangeWrapper, error);
          } finally {
            this.currenciesPage.loader.remove();
            this.currenciesPage.wrapper.classList.remove("wrapper--loading");
          }
        }
      } catch (error) {
        this.handleError(this.currencyExchangeWrapper, error);
        isValid = false;
        this.currenciesPage.loader.remove();
        this.currenciesPage.wrapper.classList.remove("wrapper--loading");
      }
    }
    return isValid;
  }

  /**
   * Отправка запроса на обмен валюты.
   *
   * Этот метод выполняет запрос к API для обмена валюты.
   *
   * @async
   * @param {string} from - Код валюты, из которой происходит обмен.
   * @param {string} to - Код валюты, в которую происходит обмен.
   * @param {number} amount - Сумма для обмена.
   * @returns {Promise<{ payload: Object }|{ error: string }|null>} - Возвращает промис с результатом обмена.
   *  - payload (Object): Информация о выполненной операции, если операция была успешной.
   *  - error (string): Сообщение об ошибке, если операция не была успешной.
   */
  async postExchange(from, to, amount) {
    try {
      const response = await postCurrencyBuy(this.token, from, to, amount);
      if (response.error) {
        this.dataCurrencies = null;
        this.isLoading = false;
        return { error: response.error };
      } else {
        this.dataCurrencies = response.payload;
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
