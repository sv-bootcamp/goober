import {combineReducers} from 'redux';
import userReducer from './user';
import mapReducer from './map';
import cardReducer from './cards';

export default combineReducers({
  user: userReducer,
  map: mapReducer,
  cards: cardReducer
});
