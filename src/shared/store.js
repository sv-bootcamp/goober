import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

// Note: this API requires redux@>=3.1.0
export default createStore(
    rootReducer,
    applyMiddleware(
        thunk
    )
);
