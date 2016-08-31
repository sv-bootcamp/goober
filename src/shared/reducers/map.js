import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
	get: {
		status: 'INIT',
		markers: [],
		error: -1
	}
};

export default function map(state, action) {
	if(typeof state === "undefined") {
		state = initialState;
	}
	
	switch(action.type) {
		case types.GET_MAP_MARKERS_SUCCESS:
			return update(state, {
				get: {
					status: { $set: 'SUCCESS'},
					markers: { $set: action.data }
				}				
			});		
		default:
			return state;			
	}
}