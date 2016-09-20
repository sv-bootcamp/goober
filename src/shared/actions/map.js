import {
	// GET_MAP_MARKERS,
	GET_MAP_MARKERS_SUCCESS,
	GET_MAP_MARKERS_FAILURE,
  SELECT_MAP_MARKER,
  ADD_MAP_MARKER
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
    return axios.get('/api/items')
    .then((response) => {      
      const jsondata = JSON.parse(JSON.stringify(response.data));
      dispatch(getMapMarkersSuccess([jsondata]));      
    }).catch((error) => {
      dispatch(getMapMarkersFailure(error));
    });
  };
}

export function selectMapMarker(data) {
  return {
    type: SELECT_MAP_MARKER,
    data
  };
}

export function addMapMarker(data) {
  return {
    type: ADD_MAP_MARKER,
    data
  };
}
