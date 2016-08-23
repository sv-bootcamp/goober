/* eslint-disable no-unreachable */
import reduceReducers from 'reduce-reducers';

const defaultState = {
  accessToken: null,
  count: -1,
  name: null
};

export default reduceReducers(
  (state = defaultState, action) => {
    switch (action.type) {
    case 'GET_USER_SUCCESS':
      return action.payload;
    case 'GET_USER_FAILURE':
      return action.payload;
    default:
      return state;
    }
    return state;
  }
);
