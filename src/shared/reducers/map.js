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
	let thisState = state;
	if(typeof thisState === "undefined") {
		thisState = initialState;
	}
	
	switch(action.type) {
		case types.GET_MAP_MARKERS_SUCCESS:
			return update(thisState, {
				get: {
					status: { $set: 'SUCCESS'},
					markers: { $set: action.data }
				}				
			});		
		default:
			return thisState;			
	}
}