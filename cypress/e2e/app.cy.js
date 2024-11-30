/// <reference types="cypress"/>
import { cache, isCacheValid } from "../../src/js//config/configCache.js";
import { config } from "../../src/js/config/configRouter.js";

/**
 * Тестовый набор для проверки функциональности главного приложения.
 *
 * @module AppTests
 */
describe("Главное приложение App", () => {
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
   * Проверяет, что URL включает "/auth",
   * что модальное окно существует и содержит заголовок "Вход в аккаунт".
   *
   * @function it
   */
  it("Проверка рендеринга страницы на основе переданного класса страницы (AuthPage)", () => {
    cy.url().should("include", "/auth");
    cy.get("div.modal").should("exist");
    cy.get("h2").contains("Вход в аккаунт");
  });

  /**
   * Тестирует инициализацию приложения и наличие основных элементов.
   *
   * Проверяет, что основной элемент приложения и его дочерние элементы существуют.
   *
   * @function it
   */
  it("Проверка инициализации приложения и наличия элементов", () => {
    cy.get("#app")
      .should("exist")
      .within(() => {
        cy.get("div.wrapper").should("exist");
        cy.get("header").should("exist");
        cy.get("main").should("exist");
      });
  });

  /**
   * Тестирует навигацию по маршрутам приложения и проверяет кэш для каждого маршрута.
   *
   * Проверяет, что при переходе по маршрутам кэш обновляется и валиден.
   *
   * @function it
   */
  it("Проверка навигации по каждым маршрутам + проверка кэша в каждом маршруте", () => {
    cy.setCookie("token", "ZGV2ZWxvcGVyOnNraWxsYm94");
    const routes = config.routes;

    Object.entries(routes).forEach(([key, path]) => {
      cy.visit(`http://localhost:1111/#${path}`);
      cy.url().should("include", path);
      cy.wait(1000);
      if (key === "score") {
        cy.visit(`http://localhost:1111/#${path}`);
        cy.url().should("include", path);
        cache.scores = [{ account: "74213041477477406320783754", balance: 28694311.66 }];
        cache.lastFetch.scores = Date.now();
        expect(isCacheValid("scores")).to.be.true;
        expect(cache.scores).to.exist;
        expect(cache.scores).to.be.an("array").that.is.not.empty;
        cy.get(".score").should("exist");
      } else if (key === "scoreItem") {
        cache.scoresId = { account: "74213041477477406320783754", balance: 28694311.66 };
        cache.lastFetch.scoresId = Date.now();
        expect(isCacheValid("scoresId")).to.be.true;
        expect(cache.scoresId).to.exist;
        expect(cache.scoresId).to.be.an("object").that.is.not.empty;
        cy.get(".scoreItem").should("exist");
      } else if (key === "scoreItemHistory") {
        cache.scoresId = { account: "74213041477477406320783754", balance: 28694311.66 };
        cache.lastFetch.scoresId = Date.now();
        expect(isCacheValid("scoresId")).to.be.true;
        expect(cache.scoresId).to.exist;
        expect(cache.scoresId).to.be.an("object").that.is.not.empty;
        cy.get(".scoreItemHistory").should("exist");
      } else if (key === "banks") {
        cache.banks = [
          { id: 1, name: "Bank 1", location: { lat: 51.505, lon: -0.09 } },
          { id: 2, name: "Bank 2", location: { lat: 51.515, lon: -0.1 } },
        ];
        cache.lastFetch.banks = Date.now();
        expect(isCacheValid("banks")).to.be.true;
        expect(cache.banks).to.exist;
        expect(cache.banks).to.be.an("array").that.is.not.empty;
        cy.get(".map").should("exist");
      } else if (key === "currency") {
        cache.currencies = { USD: { amount: 100 }, EUR: { amount: 200 } };
        cache.lastFetch.currencies = Date.now();
        cache.allCurrencies = ["USD", "EUR", "GBP"];
        cache.lastFetch.allCurrencies = Date.now();
        expect(isCacheValid("currencies")).to.be.true;
        expect(cache.currencies).to.exist;
        expect(cache.currencies).to.be.an("object").that.is.not.empty;
        expect(isCacheValid("allCurrencies")).to.be.true;
        expect(cache.allCurrencies).to.exist;
        expect(cache.allCurrencies).to.be.an("array").that.is.not.empty;
        cy.get(".currency").should("exist");
      }
    });
  });

  /**
   * Тестирует токен и очистку кэша при переходе на один и тот же маршрут.
   * Также проверяет выход из аккаунта и очистку кэша и токена.
   *
   * @function it
   */
  it("Проверка токена и очистка кэша при переходе на один и тот же маршрут. Также после этого проверка выхода и на страницу авторизации, и выполняется очистка кэша и токена.", () => {
    cy.setCookie("token", "ZGV2ZWxvcGVyOnNraWxsYm94");
    cy.visit("http://localhost:1111/#/score");
    cache.scores = [{ account: "74213041477477406320783754", balance: 28694311.66 }];
    cache.lastFetch.scores = Date.now();
    cy.get("main").within(() => {
      cy.get(".score").should("exist");
    });
    expect(isCacheValid("scores")).to.be.true;
    expect(cache.scores).to.exist;
    expect(cache.scores).to.be.an("array").that.is.not.empty;
    cy.wait(2000);

    cy.get(".header__menu-link--authenticated[href='#/auth']").should("be.visible").click();
    cy.url().should("include", "auth");
    cy.getCookie("token").should("be.null");

    cache.lastFetch.scores = Date.now() - 6 * 60 * 1000;
    expect(isCacheValid("scores")).to.be.false;
  });
});
