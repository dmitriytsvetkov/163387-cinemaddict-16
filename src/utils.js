import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomFloat = (minValue, maxValue, precision) => {
  if (minValue < 0 || maxValue < 0) {
    throw new Error('Min or Max value must be greater or equals to 0');
  }
  if (maxValue <= minValue) {
    throw new Error('Min should be less than max');
  }
  return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
};

const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

const getRandomArray = ([...source], maxLength) => Array.from(
  { length: Math.min(source.length, 1 + Math.random() * maxLength | 0) },
  () => source.splice(Math.random() * source.length | 0, 1)[0],
);

const getFormattedDate = (date, formatString) => dayjs(date).format(formatString);

const renderTemplate = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

const createContainer = (tagName, className) => {
  const result = document.createElement(tagName);
  result.classList.add(className);
  return result;
};

const getRandomUniqueArray = (maxValue, length) => {
  const arr = [];
  while(arr.length < length){
    const r = Math.floor(Math.random() * maxValue) + 1;
    if(arr.indexOf(r) === -1) {
      arr.push(r);
    }
  }
  return arr;
};

export {getRandomArrayElement, getRandomArray, getRandomInteger, getRandomFloat, getFormattedDate, renderTemplate, createContainer, getRandomUniqueArray};
