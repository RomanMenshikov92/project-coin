import { el, mount } from "redom";
import cardValidator from "card-validator";
import IconInButton from "./Icons.js";
import { postScores } from "../api/fetchScore.js";
import { configSkeletonItem } from "../config/configSkeletonItem.js";
import ErrorDisplay from "../components/Error.js";
import visaImgLogo from "../../assets/images/logo_visa.png";
import masterCardImgLogo from "../../assets/images/logo_mastercard.png";
import mirImgLogo from "../../assets/images/logo_mir.png";
import maestroImgLogo from "../../assets/images/logo_maestro.png";
import americanExpressImgLogo from "../../assets/images/logo_american-express.png";
import bitcoinImgLogo from "../../assets/images/logo_bitcoin.png";

/**
 * Класс ScoreItemTranslation отвечает за создание и обработку формы перевода средств.
 *
 * Этот класс управляет отображением формы перевода, валидацией введенных данных,
 * отправкой данных на сервер и отображением ошибок.
 *
 * @export
 * @class ScoreItemTranslation
 * @typedef {ScoreItemTranslation}
 */
export default class ScoreItemTranslation {
  /**
   * Создание экземпляра класса ScoreItemTranslation.
   *
   * @constructor
   * @param {string} token - Токен аутентификации пользователя.
   * @param {Object} scoreItemPage - Экземпляр класса ScoreItemPage, к которому относится блок переводов между счетов.
   */
  constructor(token, scoreItemPage) {
    this.scoreItemPage = scoreItemPage;
    this.currentAccount = null;
    this.dataScore = null;
    this.token = token;
    this.error = null;
    this.isLoading = true;
    this.scoresItemTranslation = null;
    this.scoresItemTranslationTitle = null;
    this.scoresItemTranslationForm = null;
    this.scoresItemTranslationLabelNumber = null;
    this.scoresItemTranslationLabelAmount - null;
    this.scoresItemTranslationInputNumber = null;
    this.scoresItemTranslationInputAmount = null;
    this.scoresItemTranslationLabelNumberDiv = null;
    this.dropdown = null;
    this.accountNumbers = this.loadAccountNumbersFromLocalStorage() || [];
    this.errorDisplay = new ErrorDisplay();
  }

  /**
   * Рендер элемента формы перевода.
   *
   * Этот метод создает структуру элемента формы, включая заголовок и поля ввода,
   * и монтирует его в указанный контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет смонтирован элемент формы перевода.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    this.scoresItemTranslation = el("div.scoreItem__bottom-translation");
    this.scoresItemTranslation.id = "scoreItemTranslation";
    this.scoresItemTranslation.setAttribute("draggable", "true");

    this.scoresItemTranslationTitle = el("h3.title.scoreItem__bottom-translation-title", "Новый перевод");
    this.scoresItemTranslationForm = el("form.scoreItem__bottom-translation-form", {
      id: "translation-score",
      action: "/",
      method: "POST",
      "aria-label": "Форма текущего перевода",
      autocomplete: "on",
    });
    this.scoresItemTranslationLabelNumber = el("label.scoreItem__bottom-translation-form-label", {
      for: "numberScore",
    });
    this.scoresItemTranslationLabelAmount = el("label.scoreItem__bottom-translation-form-label", {
      for: "amountScore",
    });
    const scoresItemTranslationLabelNumberSpan = el(
      "span.scoreItem__bottom-translation-form-label-span",
      "Номер счёта получателя"
    );
    const scoresItemTranslationLabelAmountSpan = el(
      "span.scoreItem__bottom-translation-form-label-span",
      "Сумма перевода"
    );
    this.scoresItemTranslationInputNumber = el(
      "input.input-reset.scoreItem__bottom-translation-form-label-input scoreItem__bottom-translation-form-label-input--number",
      {
        id: "numberScore",
        type: "text",
        name: "numberScore",
        required: true,
        "aria-label": "Введите номер счёта",
        placeholder: "Placeholder",
        autocomplete: "on",
      }
    );
    this.scoresItemTranslationInputAmount = el(
      "input.input-reset.scoreItem__bottom-translation-form-label-input scoreItem__bottom-translation-form-label-input--amount",
      {
        id: "amountScore",
        type: "number",
        name: "amountScore",
        "aria-label": "Введите сумму",
        required: true,
        placeholder: "Placeholder",
        min: "0",
        step: "0.01",
        autocomplete: "off",
      }
    );
    this.scoresItemTranslationLabelNumberDiv = el(".scoreItem__bottom-translation-form-label-div");

    const scoresItemTranslationBtn = el(
      "button.btn-reset.scoreItem__bottom-translation-form-btn",
      { id: "btnScoreTranslationSend", type: "submit" },
      "Отправить"
    );
    const iconSendBtn = new IconInButton(null, null, null, null, scoresItemTranslationBtn);
    iconSendBtn.renderLetterSendIcon();

    this.dropdown = el("div.scoreItem__bottom-translation-form-label-dropdown");
    const dropdownList = el("ul.list-reset.scoreItem__bottom-translation-form-label-dropdown-list");
    mount(this.dropdown, dropdownList);

    if (this.accountNumbers.length > 0) {
      const spanIcon = el("span.scoreItem__bottom-translation-form-label-icon");
      mount(this.scoresItemTranslationLabelNumberDiv, spanIcon);
      const iconArrowSelect = new IconInButton(
        null,
        spanIcon,
        null,
        null,
        null,
        "scoreItem__bottom-translation-form-label-icon-svg"
      );
      iconArrowSelect.renderArrowIcon();
      this.renderDropdown();
    }

    this.scoresItemTranslationInputNumber.addEventListener("click", this.handleInputFocus.bind(this));
    scoresItemTranslationBtn.addEventListener("click", this.handleSendClick.bind(this));
    this.scoresItemTranslationInputNumber.addEventListener("input", (event) => {
      this.clearErrorMessages();
      this.validateCardNumber(event.target.value);
    });
    this.scoresItemTranslationInputAmount.addEventListener("input", this.clearErrorMessages.bind(this));

    mount(this.scoresItemTranslationLabelNumber, scoresItemTranslationLabelNumberSpan);
    mount(this.scoresItemTranslationLabelNumber, this.scoresItemTranslationLabelNumberDiv);
    mount(this.scoresItemTranslationLabelNumberDiv, this.scoresItemTranslationInputNumber);
    mount(this.scoresItemTranslationLabelAmount, scoresItemTranslationLabelAmountSpan);
    mount(this.scoresItemTranslationLabelAmount, this.scoresItemTranslationInputAmount);
    mount(this.scoresItemTranslationForm, this.scoresItemTranslationLabelNumber);
    mount(this.scoresItemTranslationForm, this.scoresItemTranslationLabelAmount);
    mount(this.scoresItemTranslationForm, scoresItemTranslationBtn);
    mount(this.scoresItemTranslation, this.scoresItemTranslationTitle);
    mount(this.scoresItemTranslation, this.scoresItemTranslationForm);
    mount(container, this.scoresItemTranslation);
  }

  /**
   * Валидация номера карты.
   *
   * Этот метод проверяет, является ли введенный номер карты действительным,
   * и отображает соответствующий логотип карты.
   *
   * @param {string} cardNumber - Номер карты для валидации.
   * @returns {string|null} - Тип карты, если валидация успешна, иначе null.
   */
  validateCardNumber(cardNumber) {
    const validation = cardValidator.number(cardNumber);
    let cardType;

    const logoMap = {
      Visa: visaImgLogo,
      Mastercard: masterCardImgLogo,
      Mir: mirImgLogo,
      Maestro: maestroImgLogo,
      "American Express": americanExpressImgLogo,
    };
    const logoBitcoin = bitcoinImgLogo;
    const iconContainer = this.scoresItemTranslationLabelNumberDiv.querySelector(
      ".scoreItem__bottom-translation-form-label-div-type"
    );
    if (!cardNumber) {
      if (iconContainer) iconContainer.remove();
      return;
    }
    if (iconContainer) iconContainer.remove();

    if (validation.isValid) {
      cardType = validation.card?.type;
      const logoSrc = logoMap[cardType.charAt(0).toUpperCase() + cardType.slice(1)];
      if (logoSrc) {
        const iconElement = el("img.scoreItem__bottom-translation-form-label-div-type-img", {
          src: logoSrc,
          alt: `${cardType} logo`,
        });
        const newIconContainer = el("span.scoreItem__bottom-translation-form-label-div-type");
        mount(newIconContainer, iconElement);
        mount(this.scoresItemTranslationLabelNumberDiv, newIconContainer);
      }
    } else {
      cardType = "bitcoin";
      const bitcoinIconElement = el("img.scoreItem__bottom-translation-form-label-div-type-img", {
        src: logoBitcoin,
        alt: `${cardType}`,
      });
      const newIconContainer = el("span.scoreItem__bottom-translation-form-label-div-type");
      mount(newIconContainer, bitcoinIconElement);
      mount(this.scoresItemTranslationLabelNumberDiv, newIconContainer);
    }
    return cardType;
  }

  /**
   * Обработка фокуса на поле ввода номера счета.
   *
   * Этот метод открывает выпадающий список для выбора счета, если он доступен.
   *
   * @param {MouseEvent} event - Событие клика.
   * @returns {void} - Не возвращает значение.
   */
  handleInputFocus(event) {
    event.preventDefault();
    const input = event.target;
    const iconElement = document.querySelector(".scoreItem__bottom-translation-form-label-icon");
    if (this.accountNumbers.length > 0) {
      this.dropdown.classList.toggle("scoreItem__bottom-translation-form-label-dropdown--open");
      if (!iconElement) {
        const spanIcon = el("span.scoreItem__bottom-translation-form-label-icon");
        mount(input.parentElement, spanIcon);
        const iconArrowSelect = new IconInButton(
          null,
          spanIcon,
          null,
          null,
          null,
          "scoreItem__bottom-translation-form-label-icon-svg"
        );
        iconArrowSelect.renderArrowIcon();
      } else {
        iconElement.classList.toggle("score__top-select-main-icon--rotate");
      }

      this.renderDropdown();
      mount(input.parentElement, this.dropdown);

      document.addEventListener("click", this.handleDocumentClick.bind(this));
    }
  }

  /**
   * Обрабатывает клик вне выпадающего списка.
   *
   * Этот метод закрывает выпадающий список, если клик был вне его области.
   *
   * @param {MouseEvent} event - Событие клика.
   * @returns {void} - Не возвращает значение.
   */
  handleDocumentClick(event) {
    const input = this.scoresItemTranslationInputNumber;
    const dropdown = this.dropdown;

    if (!input.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.classList.remove("scoreItem__bottom-translation-form-label-dropdown--open");
      const iconElement = document.querySelector(".scoreItem__bottom-translation-form-label-icon");
      if (iconElement) {
        iconElement.classList.remove("score__top-select-main-icon--rotate");
      }
      document.removeEventListener("click", this.handleDocumentClick.bind(this));
    }
  }

  /**
   * Очищает сообщения об ошибках.
   *
   * Этот метод удаляет все сообщения об ошибках из формы.
   *
   * @returns {void} - Не возвращает значение.
   */
  clearErrorMessages() {
    this.scoresItemTranslationLabelNumber
      .querySelector(".scoreItem__bottom-translation-form-label-error-own")
      ?.remove();
    this.scoresItemTranslationLabelNumber.querySelector(".scoreItem__bottom-translation-form-label-error")?.remove();
    this.scoresItemTranslationLabelAmount.querySelector(".scoreItem__bottom-translation-form-label-error")?.remove();
  }

  /**
   * Обрабатывает клик по кнопке отправки формы.
   *
   * Этот метод выполняет валидацию данных и отправляет их на сервер.
   *
   * @param {MouseEvent} event - Событие клика.
   * @returns {Promise<boolean>} - Возвращает промис, который разрешается в true, если перевод успешен, или false в противном случае.
   */
  async handleSendClick(event) {
    event.preventDefault();
    const ownNumber = this.currentAccount;
    const numberScore = this.scoresItemTranslationInputNumber.value.trim();
    const cardType = this.validateCardNumber(numberScore);
    const amountScore = parseFloat(this.scoresItemTranslationInputAmount.value.trim());
    let errorMessageResponse = el("span.scoreItem__bottom-translation-form-label-error-own");
    const errorMessageOwn = el("span.scoreItem__bottom-translation-form-label-error-own");
    const errorMessageNumber = el("span.scoreItem__bottom-translation-form-label-error");
    const errorMessageAmount = el("span.scoreItem__bottom-translation-form-label-error");
    let isValid = true;
    this.dataScore = {
      from: ownNumber,
      to: numberScore,
      amount: amountScore,
    };

    this.clearErrorMessages();

    if (ownNumber === numberScore) {
      errorMessageOwn.textContent = "Невозможно перевести средства на собственный счёт";
      mount(this.scoresItemTranslationLabelNumber, errorMessageOwn);
      isValid = false;
    } else if (numberScore === "") {
      errorMessageNumber.textContent = "Пожалуйста, заполните все поля и введите корректную сумму";
      mount(this.scoresItemTranslationLabelNumber, errorMessageNumber);
      isValid = false;
    } else if (isNaN(amountScore) || amountScore <= 0) {
      errorMessageAmount.textContent = "Сумма перевода должна быть положительной";
      mount(this.scoresItemTranslationLabelAmount, errorMessageAmount);
      isValid = false;
    } else {
      errorMessageOwn.textContent = "";
      errorMessageResponse.textContent = "";
      try {
        const [response] = await Promise.all([
          this.postTransfer(this.dataScore.from, this.dataScore.to, this.dataScore.amount),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);
        if (response.error) {
          if (response.error === "Invalid account from") {
            errorMessageResponse.textContent = "Не указан адрес счёта списания, или этот счёт не принадлежит нам";
            mount(this.scoresItemTranslationLabelNumber, errorMessageResponse);
          } else if (response.error === "Invalid account to") {
            errorMessageResponse.textContent = "Не указан счёт зачисления, или этого счёта не существует";
            mount(this.scoresItemTranslationLabelNumber, errorMessageResponse);
          } else if (response.error === "Invalid amount") {
            errorMessageResponse.textContent = "Не указана сумма перевода, или она отрицательная;";
            mount(this.scoresItemTranslationLabelNumber, errorMessageResponse);
          } else if (response.error === "Overdraft prevented") {
            errorMessageResponse.textContent = "Мы попытались перевести больше денег, чем доступно на счёте списания.";
            mount(this.scoresItemTranslationLabelNumber, errorMessageResponse);
          } else {
            errorMessageResponse.textContent = response.error;
            mount(this.scoresItemTranslationLabelNumber, errorMessageResponse);
          }
          isValid = false;
        } else {
          const exists = this.accountNumbers.some((account) => account.number === numberScore);
          if (!exists) {
            this.accountNumbers.push({ number: numberScore, type: cardType });
            this.saveAccountNumbersToLocalStorage();
          }
          this.scoresItemTranslationInputNumber.value = "";
          this.scoresItemTranslationInputAmount.value = "";
          this.validateCardNumber("");

          try {
            this.scoreItemPage.loader.render(this.scoreItemPage.wrapper);
            this.scoreItemPage.wrapper.classList.add("wrapper--loading");
            const [updatedScore] = await Promise.all([
              this.scoreItemPage.getAccountById(this.scoreItemPage.id),
              new Promise((resolve) => setTimeout(resolve, 1000)),
            ]);

            this.scoreItemPage.updateComponentsAfter(
              updatedScore.account,
              updatedScore.balance,
              updatedScore.transactions
            );
          } catch (error) {
            this.handleError(this.scoresItemTranslation, error);
          } finally {
            this.scoreItemPage.loader.remove();
            this.scoreItemPage.wrapper.classList.remove("wrapper--loading");
          }
        }
      } catch (error) {
        this.handleError(this.scoresItemTranslation, error);
        isValid = false;
        this.scoreItemPage.loader.remove();
        this.scoreItemPage.wrapper.classList.remove("wrapper--loading");
      }
    }
    return isValid;
  }

  /**
   * Отправка запроса на перевод
   *
   * Этот метод выполняет запрос к API для выполнения перевода средств.
   *
   * @param {string} from - Номер счета отправителя.
   * @param {string} to - Номер счета получателя.
   * @param {number} amount - Сумма перевода.
   * @returns {Promise<{ payload: Object }|{ error: string }|null>} - Возвращает промис с результатом перевода.
   *   - payload (Object): Информация о выполненной операции, если операция была успешной.
   *   - error (string): Сообщение об ошибке, если операция не была успешной.
   */
  async postTransfer(from, to, amount) {
    try {
      const response = await postScores(this.token, from, to, amount);
      if (response.error) {
        this.dataScore = null;
        this.isLoading = false;
        return { error: response.error };
      } else {
        this.dataScore = response.payload;
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
   * Рендерит выпадающий список для выбора счета.
   *
   * Этот метод создает список доступных счетов и монтирует его в элемент выпадающего списка.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderDropdown() {
    const dropdownList = this.dropdown.querySelector("ul.scoreItem__bottom-translation-form-label-dropdown-list");
    dropdownList.innerHTML = "";

    this.accountNumbers.forEach(({ number, type }) => {
      const listItem = el("li.scoreItem__bottom-translation-form-label-dropdown-list-item");

      const logoMap = {
        Visa: visaImgLogo,
        Mastercard: masterCardImgLogo,
        Mir: mirImgLogo,
        Maestro: maestroImgLogo,
        "American Express": americanExpressImgLogo,
        Bitcoin: bitcoinImgLogo,
      };
      const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
      const logoSrc = logoMap[formattedType];
      const logoElement = el("img.scoreItem__bottom-translation-form-label-dropdown-list-item-img", {
        src: logoSrc,
        alt: `${type} logo`,
      });
      mount(listItem, el("span.scoreItem__bottom-translation-form-label-dropdown-list-item-text", number));
      mount(listItem, logoElement);
      listItem.addEventListener("click", () => {
        this.scoresItemTranslationInputNumber.value = number;
        this.validateCardNumber(number);
        const iconElement = document.querySelector(".scoreItem__bottom-translation-form-label-icon");
        if (iconElement) {
          iconElement.classList.remove("score__top-select-main-icon--rotate");
        }
      });

      mount(dropdownList, listItem);
    });
  }

  /**
   * Загружает номера счетов из локального хранилища.
   *
   * Этот метод извлекает сохраненные номера счетов из localStorage.
   *
   * @returns {Array<Object>} - Массив объектов с номерами счетов.
   */
  loadAccountNumbersFromLocalStorage() {
    const storedNumbers = localStorage.getItem("accountNumbers");
    return storedNumbers ? JSON.parse(storedNumbers) : [];
  }

  /**
   * Сохраняет номера счетов в локальное хранилище.
   *
   * Этот метод сохраняет текущие номера счетов в localStorage.
   *
   * @returns {void} - Не возвращает значение.
   */
  saveAccountNumbersToLocalStorage() {
    localStorage.setItem("accountNumbers", JSON.stringify(this.accountNumbers));
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
  }

  /**
   * Обновляет состояние компонента с новыми данными о счете.
   *
   * Этот метод обновляет номер текущего счета, состояние загрузки и сообщение об ошибке.
   *
   * @param {string} currentAccount - Номер текущего счета.
   * @param {boolean} isLoading - Флаг, указывающий, происходит ли загрузка данных.
   * @param {string|null} error - Сообщение об ошибке, если она произошла.
   * @returns {void} - Не возвращает значение.
   */
  update(currentAccount, isLoading, error) {
    this.currentAccount = currentAccount;
    this.isLoading = isLoading;
    this.error = error;

    this.renderLoadingOrError();
  }

  /**
   * Рендерит состояние загрузки или ошибки.
   *
   * Этот метод обновляет отображение в зависимости от состояния загрузки или ошибок.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderLoadingOrError() {
    const item = this.scoresItemTranslation;
    const title = this.scoresItemTranslationTitle;
    const form = this.scoresItemTranslationForm;

    if (this.isLoading && this.error === null) {
      item.classList.add("scoreItem__bottom-translation--loading", "sm-loading");
      item.dataset.smConfig = configSkeletonItem;
      const loadingItem = el("div.scoreItem__bottom-translation-load.sm-item-primary");
      item.innerHTML = "";
      mount(item, loadingItem);
    } else {
      item.classList.remove("scoreItem__bottom-translation--loading", "sm-loading");
      delete item.dataset.smConfig;
      item.querySelector("div.scoreItem__bottom-translation-load.sm-item-primary")?.remove();
    }

    if (this.error && !this.isLoading) {
      item.classList.add("scoreItem__bottom-translation--error");
      const errorItem = el("div.scoreItem__bottom-translation-failed", `Error: ${this.error}`);
      item.innerHTML = "";
      mount(item, errorItem);
    } else {
      item.classList.remove("scoreItem__bottom-translation--error");
      item.querySelector("div.scoreItem__bottom-translation-failed")?.remove();
    }

    if (this.error === null && !this.isLoading) {
      mount(item, title);
      mount(item, form);
    }
  }
}
