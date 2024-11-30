/// <reference types="cypress"/>

/**
 * Тестовый набор для проверки функциональности аутентификации.
 *
 * @module AuthenticationTests
 */
describe("Аутентификация", () => {
  /**
   * Выполняется перед каждым тестом.
   * Открывает страницу авторизации приложения.
   *
   * @function beforeEach
   */
  beforeEach(() => {
    cy.visit("http://localhost:1111/#/auth");
  });

  /**
   * Тестирует рендеринг страницы авторизации.
   *
   * Проверяет наличие модального окна, заголовка, формы и полей ввода.
   *
   * @function it
   */
  it("Проверка рендеринга страницы авторизации", () => {
    cy.get("div.modal").should("exist");
    cy.get("div.modal__content").should("exist");
    cy.get("h2.title.modal__title").should("exist").and("contain", "Вход в аккаунт");
    cy.get("form.modal__form").should("exist");
    cy.get("input[name='login'].input-reset.modal__form-input").should("exist");
    cy.get("input[name='password'].input-reset.modal__form-input").should("exist");
    cy.get("button[type='button'].btn-reset.modal__form-btn").should("exist").and("contain", "Войти");
  });

  /**
   * Тестирует успешную авторизацию с некорректными учетными данными.
   *
   * Проверяет, что при вводе некорректных логина и пароля отображаются соответствующие сообщения об ошибках.
   *
   * @function it
   */
  it("Проверка успешной авторизации с некорректными учетными данными", () => {
    const invalidLogin1 = " ";
    const invalidPassword1 = " ";
    const invalidLogin2 = "developer";
    const invalidPassword2 = "skill";
    const invalidLogin3 = "dev";
    const invalidPassword3 = "skillbox";

    cy.get("input[name='login']").clear().type(invalidLogin1);
    cy.get("input[name='password']").clear().type(invalidPassword1);
    cy.get("button[type='button']").click();
    cy.get("span.modal__form-error").should("contain", "Логин и пароль не могут быть пустыми");

    cy.get("input[name='login']").clear().type(invalidLogin2);
    cy.get("input[name='password']").clear().type(invalidPassword2);
    cy.get("button[type='button']").click();
    cy.get("span.modal__form-error").should("contain", "Пароль должен быть не менее 6 символов и не содержать пробелов");

    cy.get("input[name='login']").clear().type(invalidLogin3);
    cy.get("input[name='password']").clear().type(invalidPassword3);
    cy.get("button[type='button']").click();
    cy.get("span.modal__form-error").should("contain", "Логин должен быть не менее 6 символов и не содержать пробелов");
  });

  /**
   * Тестирует успешную авторизацию с корректными учетными данными.
   *
   * Проверяет, что при вводе корректного логина и пароля происходит переход на страницу счета.
   *
   * @function it
   */
  it("Проверка успешной авторизации с корректными учетными данными", () => {
    const validLogin = "developer";
    const validPassword = "skillbox";
    const token = "ZGV2ZWxvcGVyOnNraWxsYm94";
    cy.intercept("POST", "/login", {
      statusCode: 200,
      body: { payload: { token } },
    }).as("loginRequest");
    cy.get("input[name='login']").type(validLogin);
    cy.get("input[name='password']").type(validPassword);
    cy.get("button[type='button'].btn-reset.modal__form-btn").click();
    cy.wait("@loginRequest");
    cy.url().should("include", "/score");
    cy.getCookie("token").should("exist").and("have.property", "value", token);
  });

  /**
   * Тестирует обработку ошибки: Такого пользователя нет.
   *
   * Проверяет, что при вводе неверного логина отображается соответствующее сообщение об ошибке.
   *
   * @function it
   */
  it("Проверка обработки ошибки: Такого пользователя нет", () => {
    const invalidLogin = "designer";
    const invalidPassword = "skillbox";
    cy.intercept("POST", "/login", {
      statusCode: 200,
      body: { error: "No such user" },
    }).as("loginRequest");
    cy.get("input[name='login']").clear().type(invalidLogin);
    cy.get("input[name='password']").clear().type(invalidPassword);
    cy.get("button[type='button']").click();
    cy.wait("@loginRequest");
    cy.get("span.modal__form-error").should("contain", "Такого пользователя нет");
  });

  /**
   * Тестирует обработку ошибки: Неверный пароль.
   *
   * Проверяет, что при вводе корректного логина и неверного пароля отображается соответствующее сообщение об ошибке.
   *
   * @function it
   */
  it("Проверка обработки ошибки: Неверный пароль", () => {
    const validLogin = "developer";
    const invalidPassword = "geekbrains";
    cy.intercept("POST", "/login", {
      statusCode: 200,
      body: { error: "Invalid password" },
    }).as("loginRequest");
    cy.get("input[name='login']").clear().type(validLogin);
    cy.get("input[name='password']").clear().type(invalidPassword);
    cy.get("button[type='button']").click();
    cy.wait("@loginRequest");
    cy.get("span.modal__form-error").should("contain", "Неверный пароль");
  });

  /**
   * Тестирует обработку ошибок при получении данных о логине.
   *
   * Проверяет, что при возникновении ошибки 400 отображается соответствующее сообщение об ошибке.
   *
   * @function it
   */
  it("Проверка обработки ошибок", () => {
    const validLogin = "developer";
    const validPassword = "skillbox";
    const errorMessage = "Ошибка при получении данных о логине: 400";
    cy.intercept("POST", "/login", {
      statusCode: 400,
      body: { error: errorMessage },
    }).as("loginRequest");
    cy.get("input[name='login']").clear().type(validLogin);
    cy.get("input[name='password']").clear().type(validPassword);
    cy.get("button[type='button']").click();
    cy.wait("@loginRequest");
    cy.get("span.modal__form-error").should("be.visible").and("contain", errorMessage).and("not.be.empty");
    cy.get("form.modal__form").should("be.visible");
    cy.get("span.modal__form-error").invoke("text").should("eq", errorMessage);
  });

  /**
   * Тестирует отсутствие токена и перенаправление на страницу авторизации.
   *
   * Проверяет, что при отсутствии токена пользователь перенаправляется на страницу авторизации.
   *
   * @function it
   */
  it("Проверка отсутствия токена", () => {
    cy.clearCookies();
    cy.visit("http://localhost:1111/#/score");
    cy.url().should("include", "/auth");
    cy.get("form.modal__form").should("be.visible");
    cy.get("input[name='login']").should("be.visible");
    cy.get("input[name='password']").should("be.visible");
    cy.get("button[type='button']").should("be.visible");
  });
});
