import { ADD_CARD } from './ActionTypes';

let nextCardId = 0;
export const addCard = () => {
  nextCardId = nextCardId + 1;
  return ({
    type: ADD_CARD,
    id: nextCardId
  });
};
