import { el, mount } from "redom";

/**
 * Класс ErrorDisplay отвечает за отображение сообщений об ошибках в интерфейсе.
 *
 * Этот класс управляет созданием и обновлением элементов, отображающих ошибки,
 * а также обеспечивает временное отображение уведомлений об ошибках.
 *
 * @export
 * @class ErrorDisplay
 * @typedef {ErrorDisplay}
 */
export default class ErrorDisplay {
  /**
   * Создание экземпляра класса ErrorDisplay.
   *
   * @constructor
   */
  constructor() {
    this.element = null;
  }

  /**
   * Рендеринг сообщения об ошибке в указанном контейнере.
   *
   * Этот метод создает элемент для отображения сообщения об ошибке, если он еще не создан,
   * или обновляет текст существующего элемента.
   *
   * @param {HTMLElement} container - Контейнер, в который будет монтироваться сообщение об ошибке.
   * @param {string} message - Сообщение об ошибке для отображения.
   * @returns {HTMLElement} - Возвращает элемент, отображающий сообщение об ошибке.
   */
  render(container, message) {
    if (!this.element) {
      this.element = el("div.error", message);
      mount(container, this.element);
    } else {
      this.element.textContent = message;
    }
    return this.element;
  }

  /**
   * Отображение временного уведомления об ошибке.
   *
   * Этот метод создает новое уведомление об ошибке, монтирует его в контейнер
   * и автоматически удаляет его через заданный интервал времени.
   *
   * @param {HTMLElement} container - Контейнер, в который будет монтироваться уведомление об ошибке.
   * @param {string} message - Сообщение об ошибке для отображения.
   * @returns {void} - Не возвращает значение.
   */
  show(container, message) {
    const notification = el(".error", message);
    mount(container, notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}
