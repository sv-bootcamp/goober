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
    return axios.get('/api/map/getmarkers')
    .then((response) => {
      dispatch(getMapMarkersSuccess(response.data));
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

/*
>>>>>>> f76e7c5... make independent list container and corresponding componen, action, reducer
let nextCardId = 0;
export const addCard = () => {
  nextCardId = nextCardId + 1;
  return ({
    type: 'ADD_CARD',
    id: nextCardId
  });
};
*/
