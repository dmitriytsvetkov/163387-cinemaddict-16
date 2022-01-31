import dayjs from 'dayjs';
import SmartView from './smart-view.js';
import {createStatisticTemplate} from './templates/statistic-template';
import {DAYS_SHORTCUTS, FILTER_TYPES} from '../constants';
import {renderChart} from '../utils/movie-utils';

export default class StatisticView extends SmartView {
  #chart = null;

  constructor(cardsData) {
    super();

    this._data = {
      cardsData,
      dateFrom: null,
      dateTo: null,
      currentFilter: FILTER_TYPES.ALL
    };

    this.#setCharts();
  }

  get template() {
    return createStatisticTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

  setFiltersHandler() {
    this.element.querySelectorAll('.statistic__filters-input').forEach((input) => input.addEventListener('change', this.#filterHandler));
  }

  #filterHandler = (evt) => {
    evt.preventDefault();

    switch (evt.target.value) {
      case FILTER_TYPES.ALL:
        this.updateData({
          dateFrom: null,
          dateTo: null,
          currentFilter: FILTER_TYPES.ALL
        });
        break;
      case FILTER_TYPES.TODAY:
        this.updateData({
          dateFrom: dayjs().subtract(DAYS_SHORTCUTS.ONE_DAY, 'day').toDate(),
          dateTo: dayjs().add(DAYS_SHORTCUTS.ONE_DAY, 'day').toDate(),
          currentFilter: FILTER_TYPES.TODAY
        });
        break;
      case FILTER_TYPES.WEEK:
        this.updateData({
          dateFrom: dayjs().subtract(DAYS_SHORTCUTS.WEEK, 'day').toDate(),
          dateTo: dayjs().add(DAYS_SHORTCUTS.ONE_DAY, 'day').toDate(),
          currentFilter: FILTER_TYPES.WEEK
        });
        break;
      case FILTER_TYPES.MONTH:
        this.updateData({
          dateFrom: dayjs().subtract(DAYS_SHORTCUTS.MONTH, 'day').toDate(),
          dateTo: dayjs().add(DAYS_SHORTCUTS.ONE_DAY, 'day').toDate(),
          currentFilter: FILTER_TYPES.MONTH
        });
        break;
      case FILTER_TYPES.YEAR:
        this.updateData({
          dateFrom: dayjs().subtract(DAYS_SHORTCUTS.YEAR, 'day').toDate(),
          dateTo: dayjs().add(DAYS_SHORTCUTS.ONE_DAY, 'day').toDate(),
          currentFilter: FILTER_TYPES.YEAR
        });
        break;
    }
  }

  #setCharts = () => {
    const {cardsData, dateFrom, dateTo} = this._data;

    const statsCtx = this.element.querySelector('.statistic__chart');
    this.#chart = renderChart(statsCtx, cardsData, dateFrom, dateTo);

    this.setFiltersHandler();
  }
}

