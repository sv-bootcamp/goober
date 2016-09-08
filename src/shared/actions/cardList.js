import { ADD_CARD } from './ActionTypes';

let nextCardId = 3;
export const addCard = (text) => {
  nextCardId = nextCardId + 1;
  return ({
    type: ADD_CARD,
    id: nextCardId,
    text
  });
};
