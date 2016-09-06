import {GET_MAP_MARKERS_SUCCESS, ADD_CARD} from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  get: {
    status: 'INIT',
    markers: [],
    error: -1
  },
  cards: []
};

export default (state = initialState, action) => {
  const thisState = state || initialState;

  switch (action.type) {
  case GET_MAP_MARKERS_SUCCESS:
    return update(thisState, {
      get: {
        status: { $set: 'SUCCESS'},
        markers: { $set: action.data }
      }
    });
  case ADD_CARD:
    return update(thisState, {
      cards: { $push: [{ id: action.id, text: 'card' + action.id }]}
    });
  default:
    return state;
  }
};


// Below actions can represent action of one card.
// Purpose is to separate "cardList-actions" and "card-actions".
/*
const card = (state = {}, action) => {
  switch(action.type) {
    case ADD_CARD:
      return {
        id: action.id,
        text: action.text
      }
    default:
      return state
  }
}
*/
