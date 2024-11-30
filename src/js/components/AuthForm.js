import { el, mount } from "redom";
import { messages } from "../data/vars.js";
import { postAuthLogin } from "../api/fetchAuth.js";
import Cookies from "js-cookie";

/**
 * Класс FormAuth отвечает за создание и управление формой аутентификации.
 *
 * Этот класс создает структуру формы, обрабатывает ввод пользователя и выполняет аутентификацию.
 *
 * @export
 * @class FormAuth
 * @typedef {FormAuth}
 */
export default class FormAuth {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {Object} router - Объект маршрутизатора для навигации между страницами.
   * @param {AuthPage} authPage - Экземпляр класса AuthPage, к которому относится форма аутентификации.
   */
  constructor(router, authPage) {
    this.router = router;
    this.authPage = authPage;
    this.inputLogin = null;
    this.inputPassword = null;
    this.errorSpan = null;
    this.formAuth = null;
    this.btnAuth = null;
  }

  /**
   * Рендер формы аутентификации.
   *
   * Этот метод создает структуру формы и добавляет ее в указанный контейнер.
   *
   * @param {HTMLElement} container - Контейнер, в который будет монтироваться форма аутентификации.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    this.formAuth = el("form.modal__form", {
      id: "auth",
      action: "/",
      method: "POST",
      "aria-label": "Форма аутентификации",
      autocomplete: "off",
    });
    const labelLogin = el("label.modal__form-label", { for: "login" });
    const labelPassword = el("label.modal__form-label", { for: "password" });
    const spanLogin = el("span.modal__form-span", "Логин");
    const spanPassword = el("span.modal__form-span", "Пароль");
    this.inputLogin = el("input.input-reset.modal__form-input", {
      id: "login",
      type: "text",
      name: "login",
      "aria-label": "Введите логин",
      placeholder: "Placeholder",
      autocomplete: "on",
    });
    this.inputPassword = el("input.input-reset.modal__form-input", {
      id: "password",
      type: "password",
      name: "password",
      "aria-label": "Введите пароль",
      placeholder: "Placeholder",
      autocomplete: "on",
    });
    const divBottom = el(".modal__form-bottom");
    this.errorSpan = el("span.modal__form-error");
    this.btnAuth = el("button.btn-reset.modal__form-btn", { type: "button", "aria-hidden": "false" }, "Войти");
    this.btnAuth.addEventListener("click", async () => this.login());

    mount(labelLogin, spanLogin);
    mount(labelLogin, this.inputLogin);
    mount(labelPassword, spanPassword);
    mount(labelPassword, this.inputPassword);
    mount(this.formAuth, labelLogin);
    mount(this.formAuth, labelPassword);
    mount(this.formAuth, divBottom);
    mount(divBottom, this.btnAuth);
    mount(divBottom, this.errorSpan);
    mount(container, this.formAuth);
  }

  /**
   * Обработка входа пользователя.
   *
   * Этот метод выполняет проверку введенных данных и отправляет запрос на аутентификацию.
   *
   * @async
   * @returns {Promise<boolean>} - Возвращает промис, который разрешается в true, если аутентификация успешна, или false в противном случае.
   */
  async login(delay = 1000) {
    const inputLogin = this.inputLogin;
    const inputPassword = this.inputPassword;
    const errorSpan = this.errorSpan;
    const loginValue = inputLogin.value.trim();
    const passwordValue = inputPassword.value.trim();
    let isValid = true;

    if (loginValue === "" || passwordValue === "") {
      errorSpan.textContent = "Логин и пароль не могут быть пустыми";
      isValid = false;
    } else if (loginValue.length < 6 || loginValue.includes(" ")) {
      errorSpan.textContent = "Логин должен быть не менее 6 символов и не содержать пробелов";
      isValid = false;
    } else if (passwordValue.length < 6 || passwordValue.includes(" ")) {
      errorSpan.textContent = "Пароль должен быть не менее 6 символов и не содержать пробелов";
      isValid = false;
    } else {
      errorSpan.textContent = "";
      try {
        this.authPage.loader.render(this.authPage.wrapper);
        this.authPage.wrapper.classList.add("wrapper--loading");
        const [response] = await Promise.all([
          postAuthLogin(loginValue, passwordValue),
          new Promise((resolve) => setTimeout(resolve, delay)),
        ]);
        if (response.error) {
          if (response.error === "No such user") {
            errorSpan.textContent = "Такого пользователя нет";
          } else if (response.error === "Invalid password") {
            errorSpan.textContent = "Неверный пароль";
          } else {
            errorSpan.textContent = response.error;
          }
          isValid = false;
        } else {
          const token = response.payload;
          Cookies.set("token", token, { expires: 1 });
          // Cookies.set('token', token, { expires: 10 / (60 * 60 * 24) });
          this.router.navigate("score");
        }
        this.authPage.loader.remove();
        this.authPage.wrapper.classList.remove("wrapper--loading");
      } catch (error) {
        console.error(messages.apiError + ": ", error);
        errorSpan.textContent = error;
        isValid = false;
        this.authPage.loader.remove();
        this.authPage.wrapper.classList.remove("wrapper--loading");
      }
    }

    return isValid;
  }
}
