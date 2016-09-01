import {
	// GET_MAP_MARKERS,
	GET_MAP_MARKERS_SUCCESS,
	GET_MAP_MARKERS_FAILURE	
} from './ActionTypes';
import axios from 'axios';

export function getMapMarkersSuccess(data) {
	return {
		type: GET_MAP_MARKERS_SUCCESS,
		data
	};
}

export function getMapMarkersFailure(error) {
	return {
		type: GET_MAP_MARKERS_FAILURE,
		error
	};
}

export function getMapMarkers() {
	return (dispatch) => {
		return axios.get('/api/map/getmarkers')
		.then((response) => {
			dispatch(getMapMarkersSuccess(response));
		}).catch((error) => {
			dispatch(getMapMarkersFailure(error));
		});
	}
}


