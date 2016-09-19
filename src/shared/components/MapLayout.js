import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import { getMapMarkers, selectMapMarker, addMapMarker } from '../actions/map';
import Card from './Card.js';
import MapBlock from './MapBlock.js';

class MapLayout extends Component {

  constructor(props) {
    super(props);
    this.handleSelectMarker = this.handleSelectMarker.bind(this);
  }

  componentDidMount() {
    let props = this.props;

    props.getMapMarkers().then(
      () => {
      }
    );

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const data = [{
          id: 'Current Location',
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }];
        props.addMapMarker(data);
      });
    }
  }

  handleSelectMarker(id, data) {
    this.props.selectMapMarker(data);
  }

  render() {
    return (
      <section>
        <h2>test map</h2>
        <MapBlock markers={this.props.markers} onSelectMarker={this.handleSelectMarker} />
        <Card thisData={this.props.selectedData} />
      </section>
    );
  }
}

MapLayout.propTypes = {
  status: PropTypes.string,
  markers: PropTypes.any,
  getMapMarkers: PropTypes.func,
  selectedData: PropTypes.object,
  selectMapMarker: PropTypes.func,
  addMapMarker: PropTypes.func
};

MapLayout.defaultProps = {

};

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
