import { el, mount } from "redom";
import IconInButton from "./Icons.js";

/**
 * Класс SelectScore отвечает за создание и управление пользовательским элементом выбора для сортировки счетов.
 *
 * Этот класс создает выпадающий список с вариантами сортировки и обрабатывает выбор пользователя.
 *
 * @export
 * @class SelectScore
 * @typedef {SelectScore}
 */
export default class SelectScore {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {Object} listScoresPage - Экземпляр класса ScoreListPage, к которому относится кастомный селект.
   */
  constructor(listScoresPage) {
    this.listScoresPage = listScoresPage;
    this.customSelect = null;
    this.optionsList = null;
    this.selectedValue = null;
  }

  /**
   * Рендер пользовательского элемента выбора.
   *
   * Этот метод создает структуру элемента выбора и добавляет его в контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет монтироваться элемент выбора.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    const scoresSelect = el(".score__top-select");
    this.customSelect = el(".score__top-select-main", { id: "customSelect" }, [
      el("span.score__top-select-main-option", { "data-value": "main" }, "Сортировка"),
      el("span.score__top-select-main-icon"),
    ]);
    const iconArrowSelect = new IconInButton(
      null,
      this.customSelect.querySelector(".score__top-select-main-icon"),
      null,
      null,
      null,
      "score__top-select-main-icon-svg"
    );
    iconArrowSelect.renderArrowIcon();
    this.optionsList = el(".score__top-select-options", { id: "optionsList" }, [
      el(".score__top-select-options-item", { "data-value": "number" }, "По номеру"),
      el(".score__top-select-options-item", { "data-value": "balance" }, "По балансу"),
      el(".score__top-select-options-item", { "data-value": "transaction" }, "По последней транзакции"),
    ]);

    mount(scoresSelect, this.customSelect);
    mount(scoresSelect, this.optionsList);
    mount(container, scoresSelect);

    setTimeout(() => {
      this.initCustomSelect();
    }, 100);
  }

  /**
   * Инициализация пользовательского элемента выбора.
   *
   * Этот метод устанавливает обработчики событий для открытия и выбора опций в выпадающем списке.
   *
   * @returns {void} - Не возвращает значение.
   */
  initCustomSelect() {
    const iconElement = this.customSelect.querySelector(".score__top-select-main-icon");
    const optionTextElement = this.customSelect.querySelector(".score__top-select-main-option");
    const optionsItem = this.optionsList.querySelectorAll(".score__top-select-options-item");
    let selectedOption = null;

    this.customSelect.addEventListener("click", () => {
      this.optionsList.classList.toggle("score__top-select-options--show");
      iconElement.classList.toggle("score__top-select-main-icon--rotate");

      if (this.optionsList.classList.contains("score__top-select-options--show")) {
        optionTextElement.textContent = "Сортировка";
      } else {
        if (selectedOption) {
          optionTextElement.textContent = selectedOption;
        } else {
          optionTextElement.textContent = "Сортировка";
        }
      }
    });

    const selectValues = {
      number: "По номеру",
      balance: "По балансу",
      transaction: "По последней транзакции",
    };

    this.optionsList.addEventListener("click", (event) => {
      if (event.target.classList.contains("score__top-select-options-item")) {
        const currentElement = event.target;
        this.selectedValue = currentElement.dataset.value;
        const selectedText = selectValues[this.selectedValue];

        if (currentElement.classList.contains("score__top-select-options-item--selected")) {
          selectedOption = null;
          this.selectedValue = null;
          optionTextElement.textContent = "Сортировка";

          currentElement.classList.remove("score__top-select-options-item--selected");
          const iconCheckSelect = currentElement.querySelector(".score__top-select-options-item-icon");
          if (iconCheckSelect) {
            iconCheckSelect.remove();
          }
          this.listScoresPage.listScore.sortAccounts(null);
        } else {
          selectedOption = selectedText;
          optionTextElement.textContent = selectedText;

          optionsItem.forEach((item) => {
            item.classList.remove("score__top-select-options-item--selected");
            const iconCheckSelect = item.querySelector(".score__top-select-options-item-icon");
            if (iconCheckSelect) {
              iconCheckSelect.remove();
            }
          });

          const selectedSpan = el("span.score__top-select-options-item-icon");
          const iconCheckSelectItem = new IconInButton(null, null, selectedSpan, null, null);
          iconCheckSelectItem.renderCheckIcon();

          mount(currentElement, selectedSpan);
          currentElement.classList.add("score__top-select-options-item--selected");

          this.listScoresPage.listScore.sortAccounts(this.selectedValue);
        }

        this.optionsList.classList.remove("score__top-select-options--show");
        iconElement.classList.remove("score__top-select-main-icon--rotate");
      }
    });
  }
}
