/* eslint-disable no-unreachable */
import reduceReducers from 'reduce-reducers';

const defaultState = {
};

export default reduceReducers(
  (state = defaultState, action) => {
    return state;
  }
);
