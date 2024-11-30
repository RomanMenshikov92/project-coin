/// <reference types="cypress"/>
/**
 * Тестовый набор для проверки функциональности просмотра текущего счета.
 *
 * @module CurrentAccountViewTests
 */
describe("Просмотр по текущему счету", () => {
  /**
   * Массив моковых счетов для тестирования.
   *
   * @type {Array<Object>}
   * @property {string} account - Номер счета.
   * @property {number} balance - Баланс счета.
   * @property {Array<Object>} transactions - Массив транзакций.
   */
  let mockAccounts = [
    {
      account: "123456",
      balance: 1000,
      transactions: [],
    },
    {
      account: "654321",
      balance: 2000,
      transactions: [
        { date: "2023-01-01", amount: 500 },
        { date: "2023-01-15", amount: 300 },
      ],
    },
  ];

  /**
   * Выполняется перед каждым тестом.
   * Открывает страницу авторизации, выполняет вход и подготавливает данные для тестирования.
   *
   * @function beforeEach
   */
  beforeEach(() => {
    cy.visit("http://localhost:1111/#/auth");
    const validLogin = "developer";
    const validPassword = "skillbox";
    cy.get("input[name='login']").type(validLogin);
    cy.get("input[name='password']").type(validPassword);
    cy.get("button[type='button']").click();
    cy.intercept("GET", `/accounts`, {
      statusCode: 200,
      body: { payload: mockAccounts },
    }).as("getScores");
    cy.url().should("include", "/score");
    cy.getCookie("token").should("exist");
    cy.wait("@getScores");
    cy.get("button.btn-reset.score__bottom-item-btn").should("exist").and("contain", "Открыть");
    cy.intercept("GET", `/account/${mockAccounts[1].account}`, {
      statusCode: 200,
      body: {
        payload: {
          account: mockAccounts[1].account,
          balance: mockAccounts[1].balance,
          transactions: mockAccounts[1].transactions,
        },
      },
    }).as("getScoresId");
    cy.get(`li.score__bottom-item:nth-child(2)`).find("button.btn-reset.score__bottom-item-btn").should("exist").and("contain", "Открыть").click();
    cy.wait("@getScoresId");
    cy.visit(`http://localhost:1111/#//score/${mockAccounts[1].account}`);
  });

  /**
   * Тестирует рендеринг страницы текущего счета.
   *
   * Проверяет наличие всех необходимых элементов на странице после успешного входа и открытия счета.
   *
   * @function it
   * @name Проверка рендеринга страницы текущего счёта
   */
  it("Проверка рендеринга страницы текущего счёта", () => {
    cy.url().should("include", `/score/${mockAccounts[1].account}`);
    cy.getCookie("token").should("exist");
    cy.get("section.scoreItem").should("exist");
    cy.get("div.container.scoreItem__container").should("exist");
    cy.get("div.scoreItem__top").should("exist");
    cy.get("h2.title.scoreItem__top-title").should("exist").and("contain", "Просмотр счёта");

    cy.get("button.btn-reset.scoreItem__top-btn").should("exist").and("contain", "Вернуться назад").find("svg");

    cy.get("div.scoreItem__top-wrapper").should("exist");
    cy.get("h3.title.scoreItem__top-wrapper-number").should("exist");
    cy.get("span.scoreItem__top-wrapper-number-span").should("contain", mockAccounts[1].account);
    cy.get("h3.title.scoreItem__top-wrapper-balance").should("exist");
    cy.get("span.scoreItem__top-wrapper-balance-span").should("contain", `${mockAccounts[1].balance} ₽`);

    cy.get("div.scoreItem__bottom").should("exist");

    cy.get("div.scoreItem__bottom-translation").should("exist");
    cy.get("h3.title.scoreItem__bottom-translation-title").should("exist").and("contain", "Новый перевод");
    cy.get("form.scoreItem__bottom-translation-form").should("exist");
    cy.get("label[for='numberScore']").should("exist").and("contain", "Номер счёта получателя");
    cy.get("label[for='amountScore']").should("exist").and("contain", "Сумма перевода");
    cy.get("input#numberScore").should("exist").and("have.attr", "placeholder", "Placeholder");
    cy.get("input#amountScore").should("exist").and("have.attr", "placeholder", "Placeholder");
    cy.get("button#btnScoreTranslationSend").should("exist").and("contain", "Отправить");

    cy.get("div.scoreItem__bottom-chart").should("exist");
    if (mockAccounts[1].transactions.length > 0) {
      cy.get("h3.title.scoreItem__bottom-chart-title").should("exist").and("contain", "Динамика баланса");
      cy.get("div.scoreItem__bottom-chart-wrapper").should("exist");
      cy.get("canvas.scoreItem__bottom-chart-wrapper-canvas").should("exist");
    }
  });
});
