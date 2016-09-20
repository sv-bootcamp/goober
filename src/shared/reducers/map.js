import {GET_MAP_MARKERS_SUCCESS, SELECT_MAP_MARKER, ADD_MAP_MARKER} from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  get: {
    status: 'INIT',
    markers: [],
    error: -1
  },
  select: {
    data: {}
  },
  cards: []
};

export default (state, action) => {
  const thisState = state || initialState;

  switch (action.type) {
  case GET_MAP_MARKERS_SUCCESS:
    return update(thisState, {
      get: {
        status: { $set: 'SUCCESS'},
        markers: { $set: action.data }
      }
    });
  case SELECT_MAP_MARKER:
    return update(thisState, {
      select: {
        data: { $set: action.data }
      }
    });
  case ADD_MAP_MARKER:
    return update(thisState, {
      get: {
        markers: { $push: action.data }
      }
    }); 
  default:
    return thisState;
  }
};
