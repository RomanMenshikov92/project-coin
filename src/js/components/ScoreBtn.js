import { el, mount } from "redom";
import IconInButton from "./Icons.js";
import ErrorDisplay from "../components/Error.js";
import { postScoresAccount } from "../api/fetchScore.js";

/**
 * Класс BtnScore отвечает за создание и управление кнопкой для добавления нового счета.
 *
 * Этот класс создает кнопку и обрабатывает событие нажатия для создания нового счета.
 *
 * @export
 * @class BtnScore
 * @typedef {BtnScore}
 */
export default class BtnScore {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {string} token - Токен аутентификации пользователя.
   * @param {Object} listScoresPage - Экземпляр класса ScoreListPage, к которому относится кнопка создания нового счета.
   */
  constructor(token, listScoresPage) {
    this.token = token;
    this.listScoresPage = listScoresPage;
    this.token = token;
    this.errorDisplay = new ErrorDisplay();
  }

  /**
   * Рендер кнопки для добавления нового счета.
   *
   * Этот метод создает кнопку и добавляет ее в указанный контейнер, а также устанавливает обработчик событий.
   *
   * @param {HTMLElement} container - Контейнер, в который будет монтироваться кнопка.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    const scoresBtn = el("button.btn-reset.score__top-btn", { id: "btnScoreAdd", type: "button" });
    const iconCreatedBtn = new IconInButton(scoresBtn, null, null, null, null, null, null);
    iconCreatedBtn.renderAddIcon();

    scoresBtn.addEventListener("click", this.handleAddAccount.bind(this));
    mount(container, scoresBtn);
  }

  /**
   * Обработчик события нажатия на кнопку добавления счета.
   *
   * Этот метод выполняет действия по созданию нового счета и обновлению списка счетов.
   *
   * @param {Event} event - Событие нажатия на кнопку.
   * @returns {void} - Не возвращает значение.
   */
  async handleAddAccount(event) {
    event.preventDefault();
    try {
      this.listScoresPage.loader.render(this.listScoresPage.wrapper);
      this.listScoresPage.wrapper.classList.add("wrapper--loading");
      const [response] = await Promise.all([
        this.postCreateAccount(),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
      console.log(response);
      if (response.error) {
        this.handleError(this.listScoresPage.container);
        return;
      } else {
        try {
          const [updatedAccounts] = await Promise.all([
            this.listScoresPage.getAccounts(),
            new Promise((resolve) => setTimeout(resolve, 1000)),
          ]);
          console.log(updatedAccounts);
          this.listScoresPage.updateComponentsAfter(updatedAccounts);
        } catch (error) {
          this.handleError(this.listScoresPage.container, error);
        }
      }
    } catch (error) {
      this.handleError(this.listScoresPage.container, error);
      isValid = false;
    } finally {
      this.listScoresPage.loader.remove();
      this.listScoresPage.wrapper.classList.remove("wrapper--loading");
    }
  }

  /**
   * Запрос на создание нового счета.
   *
   * Этот метод выполняет запрос к API для создания нового счета и обновляет состояние компонента в зависимости от результата запроса.
   *
   * @async
   * @returns {Promise<{ payload: Object }|{ error: string }|null>} - Возвращает асинхронный промис.
   *   - payload (Object): Объект, представляющий информацию о созданном счете, если операция была успешной.
   *   - error (string): Сообщение об ошибке, если операция не была успешной.
   */
  async postCreateAccount() {
    try {
      const response = await postScoresAccount(this.token);
      if (response.error) {
        this.isLoading = false;
        console.log(response.error);
        return { error: response.error };
      } else {
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
   * Обработка ошибок и отображение сообщения об ошибке.
   *
   * Этот метод отвечает за отображение сообщения об ошибке в случае неудачи при создании счета или других проблемах.
   *
   * @param {HTMLElement} container - Контейнер, где будет отображаться ошибка.
   * @param {Error} [error=this.error] - Ошибка, которую нужно обработать (по умолчанию последняя ошибка).
   * @returns {void} - Не возвращает значение.
   */
  handleError(container, error = this.error) {
    console.error(error);
    this.error = error;
    this.isLoading = false;
    this.errorDisplay.show(container, error.message || error);
  }
}
