/**
 * Объект конфигурации, содержащий маршруты приложения.
 *
 * @type {Object}
 * @property {Object} routes - Объект, содержащий маршруты приложения.
 * @property {string} routes.base - Базовый маршрут приложения. Обычно корневой путь.
 * @property {string} routes.auth - Маршрут для аутентификации пользователей.
 * @property {string} routes.score - Маршрут для просмотра списка своих счетов.
 * @property {string} routes.scoreItem - Маршрут для просмотра текущего своего счета.
 * @property {string} routes.scoreItemHistory - Маршрут для просмотра истории текущего своего счета.
 * @property {string} routes.banks - Маршрут для получения информации о банкоматах.
 * @property {string} routes.currency - Маршрут для получения информации о валютах.
 */

export const config = {
  routes: {
    base: "/",
    auth: "/auth",
    score: "/score",
    scoreItem: "/score/:id",
    scoreItemHistory: "/score/:id/history",
    banks: "/banks",
    currency: "/currency",
  },
};
