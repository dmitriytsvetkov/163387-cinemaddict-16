import dayjs from 'dayjs';

const getFormattedDate = (date, formatString) => dayjs(date).format(formatString);

export {getFormattedDate};
