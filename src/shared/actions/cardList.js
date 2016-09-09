import { ADD_CARD } from './ActionTypes';

export const addCard = (text) => {
  return ({
    type: ADD_CARD,
    text
  });
};
