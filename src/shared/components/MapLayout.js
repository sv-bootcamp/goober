import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';

import { getMapMarkers, selectMapMarker } from '../actions/map';
import MapBlock from './MapBlock.js';
import MapCard from './MapCard.js';

class MapLayout extends Component {

  constructor(props) {
    super(props);
    this.handleSelectMarker = this.handleSelectMarker.bind(this);
  }

  componentDidMount() {
    this.props.getMapMarkers().then(
      () => {
        // console.log('dd:' + this.props.status + '/' + JSON.stringify(this.props.markers.data));
      }
    );
  }

  handleSelectMarker(id, data) {
    console.log(id+"/"+JSON.stringify(data));
    this.props.selectMapMarker(data);
  }

  render() {
    return (
      <section>
        <h2>test map</h2>
        <MapBlock markers={this.props.markers.data} onSelectMarker={this.handleSelectMarker} />
        <MapCard thisData={this.props.selectedData} />
      </section>
    );
  }
}

MapLayout.propTypes = {
  status: PropTypes.string,
  markers: PropTypes.object,
  getMapMarkers: PropTypes.func,
  selectedData: PropTypes.object,
  selectMapMarker: PropTypes.func  
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapLayout);
