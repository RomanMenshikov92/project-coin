import { el, mount } from "redom";
import { configSkeletonItem } from "../config/configSkeletonItem.js";
import { Chart, BarController, BarElement } from "chart.js/auto";

/**
 * Класс ScoreItemChart отвечает за создание и отображение графика динамики баланса.
 *
 * Этот класс управляет инициализацией графика, обновлением данных и отображением
 * информации о транзакциях пользователя в виде столбчатой диаграммы.
 *
 * @export
 * @class ScoreItemChart
 * @typedef {ScoreItemChart}
 */
export default class ScoreItemChart {
  /**
   * Создание экземпляра
   *
   * @constructor
   * @param {Object} router - Экземпляр маршрутизатора, который управляет навигацией между страницами.
   * @param {string} className - CSS класс для стилизации графика.
   * @param {string} title - Заголовок графика.
   * @param {boolean} [chartFull=false] - Флаг, указывающий, отображать ли данные для блока "Динамики баланса".
   * @param {boolean} [chartRatio=false] - Флаг, указывающий, отображать ли данные для блока "Соотношение входящих/исходящих транзакций".
   */
  constructor(router, className, title, chartFull = false, chartRatio = false) {
    this.router = router;
    this.transactions = [];
    this.error = null;
    this.isLoading = true;
    this.chart = null;
    this.chartContainer = null;
    this.scoresItemChartWrapper = null;
    this.scoresItemChart = null;
    this.scoresItemChartTitle = null;
    this.className = className;
    this.title = title;
    this.chartFull = chartFull;
    this.chartRatio = chartRatio;
  }

  /**
   * Рендер блока графиков.
   *
   * Этот метод создает структуру графика, включая заголовок и контейнер для графика,
   * и добавляет обработчик событий для навигации.
   *
   * @param {HTMLElement} container - Контейнер, в который будет смонтирован график.
   * @returns {void} - Не возвращает значение.
   */
  render(container) {
    this.scoresItemChart = el(`div.${this.className}__bottom-chart`);
    this.scoresItemChart.id = "scoreItemChart";
    this.scoresItemChart.setAttribute("draggable", "true");

    this.scoresItemChartTitle = el(`h3.title.${this.className}__bottom-chart-title`, `${this.title}`);
    this.scoresItemChartWrapper = el(`div.${this.className}__bottom-chart-wrapper`);
    this.chartContainer = el(`canvas.${this.className}__bottom-chart-wrapper-canvas`);

    this.scoresItemChart.addEventListener("click", this.handleNavigate.bind(this));

    mount(this.scoresItemChart, this.scoresItemChartTitle);
    mount(this.scoresItemChart, this.scoresItemChartWrapper);
    mount(this.scoresItemChartWrapper, this.chartContainer);
    mount(container, this.scoresItemChart);
  }

  /**
   * Уничтожает текущий экземпляр графика, если он существует.
   *
   * Этот метод освобождает ресурсы, связанные с графиком, чтобы предотвратить утечки памяти.
   *
   * @returns {void} - Не возвращает значение.
   */
  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  /**
   * Обновление состояния компонента с новыми данными.
   *
   * Этот метод принимает массив транзакций, текущее состояние счета, состояние загрузки и ошибку.
   *
   * @param {Array<Object>} transactions - Массив транзакций, связанных со счетом.
   * @param {string} currentAccount - Текущий счет, для которого отображается график.
   * @param {boolean} isLoading - Флаг, указывающий, происходит ли загрузка данных.
   * @param {string|null} error - Сообщение об ошибке, если она произошла.
   * @returns {void} - Не возвращает значение.
   */
  update(transactions, currentAccount, isLoading, error) {
    this.currentAccount = currentAccount;
    this.transactions = transactions;
    this.isLoading = isLoading;
    this.error = error;

    this.renderCharts();
  }

  /**
   * Рендерит графики на основе текущих данных.
   *
   * Этот метод управляет состоянием графика, включая отображение загрузки, ошибок и данных.
   *
   * @returns {void} - Не возвращает значение.
   */
  renderCharts() {
    const item = this.scoresItemChart;
    const title = this.scoresItemChartTitle;
    const wrapper = this.scoresItemChartWrapper;
    const chartWrapper = this.chartContainer;

    this.destroyChart();

    if (this.transactions && this.transactions.length === 0 && !this.isLoading && this.error === null) {
      item.classList.add(`${this.className}__bottom-chart--emptying`);
      const emptyItem = el(`div.${this.className}__bottom-chart-empty`, "В данный момент транзакции не осуществлялись");
      item.classList.remove(`${this.className}__bottom-chart--loading`, "sm-loading");
      delete item.dataset.smConfig;
      item.innerText = "";
      mount(item, emptyItem);
      return;
    } else {
      item.classList.remove(`${this.className}__bottom-chart--emptying`);
      item.querySelector(`div.${this.className}__bottom-chart-empty`)?.remove();
    }

    if (this.isLoading && this.error === null) {
      item.classList.add(`${this.className}__bottom-chart--loading`, "sm-loading");
      item.dataset.smConfig = configSkeletonItem;
      const loadingItem = el(`div.${this.className}__bottom-chart-load.sm-item-primary`);
      item.innerHTML = "";
      mount(item, loadingItem);
      return;
    } else {
      item.classList.remove(`${this.className}__bottom-chart--loading`, "sm-loading");
      delete item.dataset.smConfig;
      item.querySelector(`div.${this.className}__bottom-chart-load.sm-item-primary`)?.remove();
    }

    if (this.error && !this.isLoading) {
      item.classList.add(`${this.className}__bottom-chart--error`);
      const errorItem = el(`div.${this.className}__bottom-chart-failed`, `Error: ${this.error}`);
      item.innerHTML = "";
      mount(item, errorItem);
      return;
    } else {
      item.classList.remove(`${this.className}__bottom-chart--error`);
      item.querySelector(`div.${this.className}__bottom-chart-failed`)?.remove();
    }

    const now = new Date();
    const monthLabels = [];
    const balanceData = [];
    const cumulativeBalance = [];

    let i = this.chartFull || this.chartRatio ? 11 : 5;
    for (; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const shortMonth = monthDate.toLocaleString("default", { month: "long" }).slice(0, 3);
      monthLabels.push(shortMonth);
      balanceData.push(0);
    }

    let num = this.chartFull || this.chartRatio ? 11 : 5;
    let numMonth = this.chartFull || this.chartRatio ? 12 : 6;

    const positiveDataArray = new Array(monthLabels.length).fill(0);
    const negativeDataArray = new Array(monthLabels.length).fill(0);

    this.transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), 1);
      const transactionYear = transactionDate.getFullYear();

      if (transactionMonth >= new Date(now.getFullYear(), now.getMonth() - num, 1)) {
        const monthIndex =
          num -
          (now.getMonth() - transactionDate.getMonth() + 12 * (now.getFullYear() - transactionDate.getFullYear()));
        if (monthIndex >= 0 && monthIndex < numMonth) {
          if (this.chartRatio) {
            if (transaction.from === this.currentAccount) {
              negativeDataArray[monthIndex] += transaction.amount;
            } else {
              positiveDataArray[monthIndex] += transaction.amount;
            }
          } else {
            balanceData[monthIndex] += transaction.amount;
          }
        }
      }
    });

    let currentBalance = 0;
    let minBalance = Infinity;
    let maxBalance = -Infinity;
    let datasetChart;

    if (!this.chartRatio) {
      balanceData.forEach((amount) => {
        currentBalance += amount;
        cumulativeBalance.push(currentBalance);
        if (currentBalance < minBalance) minBalance = currentBalance;
        if (currentBalance > maxBalance) maxBalance = currentBalance;
        datasetChart = [
          {
            label: "Баланс",
            data: cumulativeBalance,
            backgroundColor: "#116ACC",
          },
        ];
      });
    } else {
      datasetChart = [
        {
          label: "Доходы",
          data: positiveDataArray,
          backgroundColor: "#76CA66",
        },
        {
          label: "Расходы",
          data: negativeDataArray,
          backgroundColor: "#FD4E5D",
        },
      ];
    }

    mount(item, title);
    mount(item, wrapper);
    mount(wrapper, chartWrapper);

    Chart.register(BarController, BarElement);

    const chartAreaBorder = {
      id: "chartAreaBorder",

      beforeDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { left, top, width, height },
        } = chart;

        ctx.save();
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.setLineDash(options.borderDash || []);
        ctx.lineDashOffset = options.borderDashOffset;
        ctx.strokeRect(left, top, width, height);
        ctx.restore();
      },
    };

    this.chart = new Chart(chartWrapper, {
      type: "bar",
      plugins: [chartAreaBorder],
      data: {
        labels: monthLabels,
        datasets: datasetChart,
        events: false,
      },
      options: {
        events: [],
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 5,
            right: 5,
          },
        },
        scales: {
          y: {
            stacked: this.chartRatio ? true : false,
            position: "right",
            beginAtZero: true,
            title: {
              display: false,
              text: "Баланс",
            },
            ticks: {
              callback: !this.chartRatio
                ? function (value, index, values) {
                  if (index === 0 || index === values.length - 1) {
                    return value.toLocaleString();
                  }
                }
                : function (value, index, values) {
                  if (index === 0 || index === values.length - 1 || index === Math.floor(values.length / 2)) {
                    return value.toLocaleString();
                  }
                },
              padding: window.innerWidth <= 600 ? 25 : 30,
              font: {
                weight: "500",
                size:
                  this.chartRatio || this.chartFull
                    ? window.innerWidth <= 768
                      ? 11
                      : window.innerWidth <= 992
                        ? 14
                        : 24
                    : window.innerWidth <= 480
                      ? 11
                      : window.innerWidth <= 600
                        ? 14
                        : 24,
                family: "WorkSans",
              },
              color: "#000",
              letterSpacing: -0.02,
            },
            grid: {
              display: false,
            },
          },
          x: {
            stacked: this.chartRatio ? true : false,
            title: {
              display: true,
            },
            ticks: {
              font: {
                weight: window.innerWidth <= 480 ? "400" : window.innerWidth <= 600 ? "600" : "700",
                size:
                  this.chartRatio || this.chartFull
                    ? window.innerWidth <= 768
                      ? 11
                      : window.innerWidth <= 992
                        ? 14
                        : 24
                    : window.innerWidth <= 480
                      ? 11
                      : window.innerWidth <= 600
                        ? 14
                        : 24,
                family: "WorkSans",
              },
              color: "#000",
              letterSpacing: -0.02,
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          chartAreaBorder: {
            borderColor: "#000000",
            borderWidth: 1,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });
  }

  /**
   * Обрабатывает навигацию при нажатии на график.
   *
   * Этот метод перенаправляет пользователя на страницу истории транзакций для текущего счета.
   *
   * @returns {void} - Не возвращает значение.
   */
  handleNavigate() {
    this.router.navigate(`score/${this.currentAccount}/history`);
  }
}
