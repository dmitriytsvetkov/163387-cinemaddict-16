import dayjs from 'dayjs';
import SmartView from './smart-view.js';
import {createStatisticsTemplate} from './templates/statistic-template';
import {FILTER_TYPES} from '../constants';
import {renderChart} from '../utils/movie-utils';

export default class StatisticsView extends SmartView {
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
    return createStatisticsTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

  setFiltersHandler() {
    this.element.querySelectorAll('.statistic__filters-input').forEach((input) => input.addEventListener('change', this._filterHandle));
  }

  _filterHandle = (evt) => {
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
          dateFrom: dayjs().subtract(1, 'day').toDate(),
          dateTo: dayjs().add(1, 'day').toDate(),
          currentFilter: FILTER_TYPES.TODAY
        });
        break;
      case FILTER_TYPES.WEEK:
        this.updateData({
          dateFrom: dayjs().subtract(7, 'day').toDate(),
          dateTo: dayjs().add(1, 'day').toDate(),
          currentFilter: FILTER_TYPES.WEEK
        });
        break;
      case FILTER_TYPES.MONTH:
        this.updateData({
          dateFrom: dayjs().subtract(31, 'day').toDate(),
          dateTo: dayjs().add(1, 'day').toDate(),
          currentFilter: FILTER_TYPES.MONTH
        });
        break;
      case FILTER_TYPES.YEAR:
        this.updateData({
          dateFrom: dayjs().subtract(366, 'day').toDate(),
          dateTo: dayjs().add(1, 'day').toDate(),
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

