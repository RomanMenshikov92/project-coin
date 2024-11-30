/**
 * Класс IconInButton отвечает за рендеринг различных иконок в кнопках интерфейса.
 *
 * Этот класс управляет созданием и отображением иконок для различных элементов интерфейса,
 * включая кнопки для создания счёта, стрелки, подтвержденные отметки и другие.
 *
 * @export
 * @class IconInButton
 * @typedef {IconInButton}
 */
export default class IconInButton {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {HTMLElement} createdScoreButton - Элемент кнопки для создания нового счёта.
   * @param {HTMLElement} arrowUpDownSelectIcon - Элемент для отображения иконки вверх/вниз.
   * @param {HTMLElement} checkSelectIcon - Элемент для отображения иконки подтвержденной отметки.
   * @param {HTMLElement} backScoreItemButton - Элемент кнопки для отображения иконки назад.
   * @param {HTMLElement} letterScoreItemButton - Элемент кнопки для отправки письма.
   * @param {string} iconClass - Класс для стилизации иконок.
   * @param {HTMLElement} burgerMenuHeaderButton - Элемент кнопки для бургер-меню.
   */
  constructor(
    createdScoreButton,
    arrowUpDownSelectIcon,
    checkSelectIcon,
    backScoreItemButton,
    letterScoreItemButton,
    iconClass,
    burgerMenuHeaderButton
  ) {
    this.createdScoreButton = createdScoreButton;
    this.arrowUpDownSelectIcon = arrowUpDownSelectIcon;
    this.checkSelectIcon = checkSelectIcon;
    this.backScoreItemButton = backScoreItemButton;
    this.letterScoreItemButton = letterScoreItemButton;
    this.iconClass = iconClass;
    this.burgerMenuHeaderButton = burgerMenuHeaderButton;
  }

  /**
   * Рендерит иконку добавления в элемент createdScoreButton.
   *
   * Метод добавляет SVG-иконку добавления и текст в элемент кнопки для создания нового счёта.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderAddIcon() {
    if (this.createdScoreButton) {
      this.createdScoreButton.innerHTML = `
        <span class="visually-hidden">Иконка добавления</span>
        <svg class="score__top-btn-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.99999 7.69167e-06L8 8.00001M8 8.00001L8.00001 16M8 8.00001L16 8.00001M8 8.00001L0 8" stroke="white" stroke-width="2"/>
        </svg>
        <span class="score__top-btn-text">Создать новый счёт</span>
      `;
    }
  }

  /**
   * Рендерит иконку вверх/вниз в элемент arrowUpDownSelectIcon.
   *
   * Метод добавляет SVG-иконку для отображения направления вверх/вниз в указанный элемент.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderArrowIcon() {
    if (this.arrowUpDownSelectIcon) {
      this.arrowUpDownSelectIcon.innerHTML = `
        <span class="visually-hidden">Иконка вверх/вниз</span>
        <svg class="${this.iconClass}" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0.5L5 5.5L10 0.5H0Z" fill="#182233"/>
        </svg>
      `;
    }
  }

  /**
   * Рендерит иконку подтвержденной отметки в элемент checkSelectIcon.
   *
   * Метод добавляет SVG-иконку подтвержденной отметки в указанный элемент.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderCheckIcon() {
    if (this.checkSelectIcon) {
      this.checkSelectIcon.innerHTML = `
        <span class="visually-hidden">Иконка подтвержденной отметки</span>
        <svg class="score__top-select-options-item-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_35705_27)">
            <path d="M9.00003 16.17L4.83003 12L3.41003 13.41L9.00003 19L21 7.00003L19.59 5.59003L9.00003 16.17Z" fill="#182233"/>
          </g>
          <defs>
            <clipPath id="clip0_35705_27">
              <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      `;
    }
  }

  /**
   * Рендерит иконку стрелки назад в элемент backScoreItemButton.
   *
   * Метод добавляет SVG-иконку стрелки назад в указанный элемент.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderArrowBackIcon() {
    if (this.backScoreItemButton) {
      this.backScoreItemButton.innerHTML = `
        <span class="visually-hidden">Иконка - стрелка назад</span>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.83 5L7.41 1.41L6 0L0 6L6 12L7.41 10.59L3.83 7L16 7V5L3.83 5Z" fill="white"/>
        </svg>
        <span class="score__top-btn-text">Вернуться назад</span>
      `;
    }
  }

  /**
   * Рендерит иконку отправки письма в элемент letterScoreItemButton.
   *
   * Метод добавляет SVG-иконку отправки письма в указанный элемент.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderLetterSendIcon() {
    if (this.letterScoreItemButton) {
      this.letterScoreItemButton.innerHTML = `
        <span class="visually-hidden">Иконка - письмо</span>
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 16H2C0.89543 16 0 15.1046 0 14V1.913C0.0466084 0.842547 0.928533 -0.00101428 2 -9.95438e-07H18C19.1046 -9.95438e-07 20 0.89543 20 2V14C20 15.1046 19.1046 16 18 16ZM2 3.868V14H18V3.868L10 9.2L2 3.868ZM2.8 2L10 6.8L17.2 2H2.8Z" fill="white"/>
        </svg>
        <span class="score__top-btn-text">Отправить</span>
      `;
    }
  }

  /**
   * Рендерит иконку бургер-меню в элемент burgerMenuHeaderButton.
   *
   * Метод добавляет SVG-иконку бургер-меню в указанный элемент.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderBurgerMenuIcon() {
    if (this.burgerMenuHeaderButton) {
      this.burgerMenuHeaderButton.innerHTML = `
        <span class="visually-hidden">Иконка - бургер-меню</span>
        <svg class="${this.iconClass}" xmlns="http://www.w3.org/2000/svg" width="78" height="44" viewBox="0 0 78 44" fill="none" class="header__btn-burger-svg header__btn-burger-svg--non-active"><path fill-rule="evenodd" clip-rule="evenodd" d="M77.2712 6.46154C77.2712 6.46154 75.6505 5.91422 74.9053 5.17613C72.7684 3.05943 0.951753 6.46154 0.951753 6.46154C0.951753 6.46154 -1.18969 1.4293 0.951753 0.26265C1.50529 -0.038917 3.68113 2.81585 16.4446 2.83276C18.5816 1.91508 74.3711 3.43741 77.2712 0.26265C78.911 -1.5324 77.2712 6.46154 77.2712 6.46154Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M0.728791 37.6515C0.728791 37.6515 2.34953 38.1858 3.09468 38.9063C5.23163 40.9726 77.0482 37.6515 77.0482 37.6515C77.0482 37.6515 79.1897 42.564 77.0482 43.7028C76.4947 43.9972 74.3189 41.2104 61.5554 41.1939C59.4184 42.0897 3.62892 40.6037 0.72879 43.7028C-0.91098 45.4551 0.728791 37.6515 0.728791 37.6515Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M0.902901 18.883C0.902901 18.883 4.48679 18.8416 5.14002 19.4857C7.27954 21.5954 77.3147 18.883 77.3147 18.883C77.3147 18.883 78.8567 26.9347 77.3147 25.0613C76.5087 24.0821 33.889 23.044 21.1101 23.0272C8.88419 21.671 1.47224 25.4382 0.902901 25.0613C-1.12863 23.7164 0.902901 18.883 0.902901 18.883Z" fill="white"></path></svg>
      `;
    }
  }
}
