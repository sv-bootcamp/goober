import { ADD_CARD } from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  cards: [
    {id: 0, text: 'card0'},
    {id: 1, text: 'card1'},
    {id: 2, text: 'card2'}
  ]
};

const card = (state = initialState, action) => {
  switch (action.type) {
  case ADD_CARD:
    return {
      id: action.id,
      text: action.text
    };
  default:
    return state;
  }
};

const cards = (state = initialState, action) => {
  const thisState = state || initialState;

  switch (action.type) {
  case ADD_CARD:
    return update(thisState, {
      cards: { $push: [card(state, action)] }
    });
  default:
    return state;
  }
};

export default cards;
