/// <reference types="cypress"/>

/**
 * Тестовый набор для проверки функциональности просмотра счетов.
 *
 * @module AccountsViewTests
 */
describe("Просмотр счетов", () => {
  /**
   * Выполняется перед каждым тестом.
   * Открывает страницу авторизации и выполняет вход с корректными данными.
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
  });

  /**
   * Тестирует рендеринг страницы просмотра всех счетов.
   *
   * Проверяет наличие всех необходимых элементов на странице после успешного входа.
   *
   * @function it
   */
  it("Проверка рендеринга страницы просмотра всех счетов", () => {
    cy.url().should("include", "/score");
    cy.getCookie("token").should("exist");
    cy.wait(1000);
    cy.get("section.score").should("exist");
    cy.get("div.container.score__container").should("exist");

    cy.get("div.score__top").should("exist");
    cy.get("h2.title.score__top-title").should("exist").and("contain", "Ваши счета");
    cy.get("div.score__top-select").should("exist");
    cy.get("div.score__top-select-main").should("exist");
    cy.get("span.score__top-select-main-option").should("exist").and("contain", "Сортировка");
    cy.get("span.score__top-select-main-icon").should("exist");
    cy.get("div.score__top-select-options").should("exist");
    cy.get("div.score__top-select-options-item").should("have.length", 3);
    cy.get("div.score__top-select-options-item[data-value='number']").should("exist").and("contain", "По номеру");
    cy.get("div.score__top-select-options-item[data-value='balance']").should("exist").and("contain", "По балансу");
    cy.get("div.score__top-select-options-item[data-value='transaction']").should("exist").and("contain", "По последней транзакции");
    cy.get("button.btn-reset.score__top-btn").should("exist").and("contain", "Создать новый счёт").find("svg.score__top-btn-icon");

    cy.get("div.score__bottom").should("exist");
    cy.get("ul.list-reset.score__bottom-list").should("exist");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").should("have.length.greaterThan", 0);
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").each(($el) => {
      cy.wrap($el)
        .find(".score__bottom-item-number")
        .should("exist")
        .and(($el) => {
          expect($el.text().trim()).to.match(/.+/);
        });
      cy.wrap($el)
        .find(".score__bottom-item-amount")
        .should("exist")
        .and(($el) => {
          expect(parseFloat($el.text().trim().replace(" ₽", "").replace(",", "."))).to.be.a("number");
        });
      cy.wrap($el)
        .find(".score__bottom-item-bottom")
        .should("exist")
        .then(($el) => {
          if ($el.children().length > 0) {
            if ($el.find(".score__bottom-item-date").length > 0) {
              cy.wrap($el)
                .find(".score__bottom-item-date")
                .should("exist")
                .and(($el) => {
                  expect($el.text().trim()).to.match(/Последняя транзакция:/);
                });
              cy.wrap($el)
                .find(".score__bottom-item-date-value")
                .should("exist")
                .and(($el) => {
                  expect($el.text().trim()).to.match(
                    /^\d{2} (январ(я|я.)?|феврал(я|я.)?|март(а|а.)?|апрел(я|я.)?|май|июн(я|я.)?|июл(я|я.)?|август(а|а.)?|сентябр(я|я.)?|октябр(я|я.)?|ноябр(я|я.)?|декабр(я|я.)?) \d{4} г\.$/
                  );
                });
            } else {
              cy.wrap($el).find(".score__bottom-item-date").should("not.exist");
            }
          } else {
            cy.wrap($el).find(".score__bottom-item-date").should("not.exist");
          }
          cy.wrap($el).find("button.btn-reset.score__bottom-item-btn").should("exist").and("contain", "Открыть");
        });
    });
  });

  /**
   * Тестирует рендеринг после успешного получения пустых данных.
   *
   * Проверяет, что отображается сообщение о том, что счетов нет.
   *
   * @function it
   */
  it("Проверка рендеринга после успешного получения пустых данных", () => {
    cy.intercept("GET", `/accounts`, {
      statusCode: 200,
      body: { payload: [] },
    }).as("getScores");
    cy.url().should("include", "/score");
    cy.getCookie("token").should("exist");
    cy.wait("@getScores");
    cy.get("ul.list-reset.score__bottom-list").should("exist");
    cy.get("ul.list-reset.score__bottom-list").should("have.class", "score__bottom-list--emptying");
    cy.get("li.score__bottom-item-empty").should("exist").and("contain", "В данный момент нет ваших счетов");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").should("not.exist");
  });

  /**
   * Тестирует рендеринг на загрузку после того, как данные еще не пришли.
   *
   * Проверяет, что отображается индикатор загрузки.
   *
   * @function it
   */
  it("Проверка рендеринга на загрузку после того, когда данные не прилетели еще", () => {
    cy.intercept("GET", `/accounts`, {
      delay: null,
      statusCode: 200,
      body: { payload: [] },
    }).as("getScores");
    cy.url().should("include", "/score");
    cy.getCookie("token").should("exist");
    cy.get("ul.list-reset.score__bottom-list").should("have.class", "score__bottom-list--loading");
    cy.get("li.score__bottom-item-load").should("have.length", 3);
    cy.wait("@getScores");
    cy.get("ul.list-reset.score__bottom-list").should("not.have.class", "score__bottom-list--loading");
    cy.get("li.score__bottom-item-load").should("not.exist");
  });

  /**
   * Тестирует рендеринг после получения данных с ошибкой.
   *
   * Проверяет, что отображается сообщение об ошибке.
   *
   * @function it
   */
  it("Проверка рендеринга после получения данных с ошибкой", () => {
    cy.intercept("GET", `/accounts`, {
      statusCode: 500,
      body: { error: "Ошибка при получении данных о счетах:" },
    }).as("getScores");
    cy.url().should("include", "/score");
    cy.getCookie("token").should("exist");
    cy.wait("@getScores").then(({ response }) => {
      cy.get("ul.list-reset.score__bottom-list").should("exist");
      cy.get("ul.list-reset.score__bottom-list").should("have.class", "score__bottom-list--error");
      cy.get("li.score__bottom-item-failed").should("exist").and("contain", `Error: ${response.body.error} ${response.statusCode}`);
    });
  });

  /**
   * Тестирует рендеринг после успешного получения данных.
   *
   * Проверяет, что все счета корректно отображаются на странице.
   *
   * @function it
   */
  it("Проверка рендеринга после успешного получения данных", () => {
    const mockAccounts = [
      {
        account: "123456",
        balance: 1000,
        transactions: [],
      },
      {
        account: "654321",
        balance: 2000,
        transactions: [
          { date: "2023-01-01", amount: 500, from: "555444333", to: "654321" },
          { date: "2023-01-15", amount: 300, from: "111222333", to: "654321" },
        ],
      },
    ];

    cy.intercept("GET", `/accounts`, {
      statusCode: 200,
      body: { payload: mockAccounts },
    }).as("getScores");

    cy.url().should("include", "/score");
    cy.getCookie("token").should("exist");
    cy.wait("@getScores");

    cy.get("ul.list-reset.score__bottom-list").should("exist");
    cy.get("ul.list-reset.score__bottom-list").should("not.have.class", "score__bottom-list--emptying");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").should("have.length", mockAccounts.length);

    mockAccounts.forEach((account, index) => {
      cy.get(`ul.list-reset.score__bottom-list li.score__bottom-item`)
        .eq(index)
        .within(() => {
          cy.get(".score__bottom-item-number").should("contain", account.account);
          cy.get(".score__bottom-item-amount").should("contain", `${account.balance} ₽`);

          if (account.transactions.length > 0) {
            cy.get(".score__bottom-item-date").should("exist").and("contain", "Последняя транзакция:");
            cy.get(".score__bottom-item-date-value").should("exist").and("contain", "15 января 2023 г.");
          } else {
            cy.get(".score__bottom-item-date").should("not.exist");
          }
        });
      cy.get("button.btn-reset.score__bottom-item-btn").should("exist").and("contain", "Открыть");
    });
  });

  /**
   * Тестирует рендеринг после успешного обновления данных.
   *
   * Проверяет, что после обновления счета данные отображаются корректно.
   *
   * @function it
   */
  it("Проверка рендеринга после успешного обновления данных", () => {
    const initialAccounts = [
      {
        account: "123456",
        balance: 1000,
        transactions: [],
      },
      {
        account: "654321",
        balance: 2000,
        transactions: [],
      },
    ];
    const updatedAccounts = [
      {
        account: "123456",
        balance: 1500,
        transactions: [],
      },
      {
        account: "654321",
        balance: 2500,
        transactions: [
          { date: "2023-01-01", amount: 500, from: "555444333", to: "654321" },
          { date: "2023-01-15", amount: 300, from: "111222333", to: "654321" },
        ],
      },
    ];
    cy.intercept("GET", `/accounts`, {
      statusCode: 200,
      body: { payload: initialAccounts },
    }).as("getInitialScores");
    cy.url().should("include", "/score");
    cy.getCookie("token").should("exist");
    cy.wait("@getInitialScores");
    cy.get("ul.list-reset.score__bottom-list").should("exist");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").should("have.length", initialAccounts.length);
    initialAccounts.forEach((account, index) => {
      cy.get(`ul.list-reset.score__bottom-list li.score__bottom-item`)
        .eq(index)
        .within(() => {
          cy.get(".score__bottom-item-number").should("contain", account.account);
          cy.get(".score__bottom-item-amount").should("contain", `${account.balance} ₽`);
          cy.get(".score__bottom-item-date").should("not.exist");
        });
    });
    cy.intercept("GET", `/accounts`, {
      statusCode: 200,
      body: { payload: updatedAccounts },
    }).as("getUpdatedScores");
    cy.get("button.btn-reset.score__top-btn").click();
    cy.wait("@getUpdatedScores");
    cy.get("ul.list-reset.score__bottom-list").should("exist");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").should("have.length", updatedAccounts.length);
    updatedAccounts.forEach((account, index) => {
      cy.get(`ul.list-reset.score__bottom-list li.score__bottom-item`)
        .eq(index)
        .within(() => {
          cy.get(".score__bottom-item-number").should("contain", account.account);
          cy.get(".score__bottom-item-amount").should("contain", `${account.balance} ₽`);

          if (account.transactions.length > 0) {
            cy.get(".score__bottom-item-date").should("exist").and("contain", "Последняя транзакция:");
            cy.get(".score__bottom-item-date-value").should("exist").and("contain", "15 января 2023 г.");
          } else {
            cy.get(".score__bottom-item-date").should("not.exist");
          }
        });
    });
  });

  /**
   * Тестирует сортировку счетов по заданному критерию.
   *
   * Проверяет, что счета сортируются корректно по номеру, балансу и последней транзакции.
   *
   * @function it
   */
  it("Проверка сортировки счетов по заданному критерию", () => {
    const mockAccounts = [
      {
        account: "654321",
        balance: 2000,
        transactions: [
          { date: "2023-01-01", amount: 500, from: "555444333", to: "654321" },
          { date: "2023-01-15", amount: 300, from: "111222333", to: "654321" },
        ],
      },
      {
        account: "123456",
        balance: 1000,
        transactions: [],
      },
      {
        account: "789012",
        balance: 1500,
        transactions: [
          { date: "2023-05-01", amount: 500 },
          { date: "2023-05-15", amount: 300 },
        ],
      },
      {
        account: "456789",
        balance: 2500,
        transactions: [],
      },
    ];
    cy.intercept("GET", `/accounts`, {
      statusCode: 200,
      body: { payload: mockAccounts },
    }).as("getScores");
    cy.url().should("include", "/score");
    cy.getCookie("token").should("exist");
    cy.wait("@getScores");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").should("have.length", mockAccounts.length);
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(0).contains("654321");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(1).contains("123456");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(2).contains("789012");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(3).contains("456789");
    cy.get(".score__top-select-main").click();
    cy.get(".score__top-select-options-item[data-value='number']").click();
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(0).contains("123456");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(1).contains("456789");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(2).contains("654321");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(3).contains("789012");
    cy.get(".score__top-select-main").click();
    cy.get(".score__top-select-options-item[data-value='balance']").click();
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(0).contains("123456");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(1).contains("789012");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(2).contains("654321");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(3).contains("456789");
    cy.get(".score__top-select-main").click();
    cy.get(".score__top-select-options-item[data-value='transaction']").click();
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(0).contains("123456");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(1).contains("456789");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(2).contains("654321");
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").eq(3).contains("789012");
  });

  /**
   * Тестирует создание нового счета.
   *
   * Проверяет, что счет корректно создается корректно и отображается на странице
   *
   * @function it
   */
  it("Проверка создания нового счета", () => {
    const mockAccounts = [
      {
        account: "123456",
        balance: 1000,
        transactions: [],
      },
    ];
    const newAccount = {
      account: "987654",
      balance: 0,
      transactions: [],
    };
    const updatedMockAccounts = [...mockAccounts, newAccount];
    cy.intercept("GET", `/accounts`, {
      statusCode: 200,
      body: { payload: mockAccounts },
    }).as("getScores");
    cy.url().should("include", "/score");
    cy.getCookie("token").should("exist");
    cy.wait("@getScores");

    cy.intercept("POST", `/create-account`, {
      statusCode: 200,
      body: { payload: newAccount },
    }).as("createAccount");
    cy.get("button.btn-reset.score__top-btn").should("exist").and("contain", "Создать новый счёт").find("svg.score__top-btn-icon");
    cy.get("button.btn-reset.score__top-btn").click();
    cy.wait("@createAccount");

    cy.intercept("GET", `/accounts`, {
      statusCode: 200,
      body: { payload: updatedMockAccounts },
    }).as("getUpdateScores");

    cy.wait("@getUpdateScores");
    cy.url().should("include", "/score");
    cy.getCookie("token").should("exist");

    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").should("have.length", 1);
    cy.get("ul.list-reset.score__bottom-list li.score__bottom-item").should("contain", newAccount.account).and("contain", `${newAccount.balance} ₽`);
  });

  /**
   * Тестирует успешный переход по текущему идентификатору счета.
   *
   * Проверяет, что при нажатии на кнопку "Открыть" происходит переход на страницу счета.
   *
   * @function it
   */
  it("Проверка успешного перехода по текущему идентификатору счета", () => {
    const mockAccounts = [
      {
        account: "123456",
        balance: 1000,
        transactions: [],
      },
    ];

    cy.intercept("GET", `/accounts`, {
      statusCode: 200,
      body: { payload: mockAccounts },
    }).as("getScores");
    cy.url().should("include", "/score");
    cy.getCookie("token").should("exist");
    cy.wait("@getScores");

    cy.get("button.btn-reset.score__bottom-item-btn").should("exist").and("contain", "Открыть");
    cy.intercept("GET", `/account/${mockAccounts[0].account}`, {
      statusCode: 200,
      body: {
        payload: {
          account: mockAccounts[0].account,
          balance: mockAccounts[0].balance,
          transactions: mockAccounts[0].transactions,
        },
      },
    }).as("getScoresId");
    cy.get(`li.score__bottom-item:first`).find("button.btn-reset.score__bottom-item-btn").should("exist").and("contain", "Открыть").click();
    cy.wait("@getScoresId");
    cy.visit(`http://localhost:1111/#//score/${mockAccounts[0].account}`);
    cy.url().should("include", `/score/${mockAccounts[0].account}`);
    cy.getCookie("token").should("exist");
    cy.wait(1000);
    cy.get("section.scoreItem").should("exist");
  });
});
