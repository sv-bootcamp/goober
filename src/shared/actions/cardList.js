import { ADD_CARD } from './ActionTypes';
import { uuid } from 'uuid4';

export const addCard = (text) => {
  let nextCardId = uuid();
  return ({
    type: ADD_CARD,
    id: nextCardId,
    text
  });
};
