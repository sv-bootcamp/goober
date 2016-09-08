import { ADD_CARD } from '../actions/ActionTypes';

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
			return state;
		default:
			console.log('h')
			return state;
	}
}

const cards = (state = initialState, action) => {
	switch (action.type) {
		case ADD_CARD:
			return card(state,action);
		default:
			return state;
	}
}

export default cards;
