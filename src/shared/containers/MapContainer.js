import { connect } from 'react-redux';
import MapLayout from '../components/MapLayout';
import { getMapMarkers, selectMapMarker, addMapMarker } from '../actions/map';

const mapStateToProps = (state) => {
  return {
    status: state.map.get.status,
    markers: state.map.get.markers,
    selectedData: state.map.select.data
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMapMarkers: () => {
      return dispatch(getMapMarkers());
    },

    selectMapMarker: (data) => {
      return dispatch(selectMapMarker(data));
    },

    addMapMarker: (data) => {
      return dispatch(addMapMarker(data));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapLayout);
