/**
 * Импорт стилей и инициализация приложения.
 *
 * Этот модуль отвечает за импорт необходимых стилей и инициализацию
 * основного приложения. Он включает в себя стили для нормализации,
 * сетки, а также пользовательские стили, определенные в SASS.
 *
 * @module main
 */

import "./assets/styles/vendor/normalize.css";
import "skeleton-mammoth/dist/skeleton-mammoth.min.css";
import "./assets/styles/vendor/spinkit.min.css";
import "./assets/styles/vars.sass";
import "./assets/styles/mixins.sass";
import "./assets/styles/fonts.sass";
import "./assets/styles/styles.sass";
import { App } from "./js/app.js";

/**
 * Создание главного экземпляра приложения и его инициализация.
 *
 * @function
 * @returns {void} - Не возвращает значение.
 */
const app = new App();
window.app = app;
app.init();
