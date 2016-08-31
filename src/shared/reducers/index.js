import {combineReducers} from 'redux';
import userReducer from './user';
import mapReducer from './map';

export default combineReducers({
  user: userReducer,
  map: mapReducer
});
