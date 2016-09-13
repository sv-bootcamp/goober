import { ADD_CARD } from './ActionTypes';

export const addCard = (title) => {
  return ({
    type: ADD_CARD,
    title
  });
};
