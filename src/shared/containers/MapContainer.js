import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';

import { getMapMarkers } from '../actions/map';
import MapBlock from '../components/MapBlock.js';


class MapContainer extends Component {

  constructor(props) {
    super(props);
    
  }

  componentDidMount() {
    this.props.getMapMarkers().then(
      () => {
        console.log('dd:' + this.props.status + '/' + JSON.stringify(this.props.markers.data));
      }
    );
  }

  render() {
    return (
      <section>
        <h2>test map</h2>
        <MapBlock markers={this.props.markers.data} />
      </section>
    );
  }
}

MapContainer.propTypes = {
  status: PropTypes.string,
  markers: PropTypes.object,
  getMapMarkers: PropTypes.func
};

MapContainer.defaultProps = {

};

const mapStateToProps = (state) => {
  return {
    status: state.map.get.status,
    markers: state.map.get.markers
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMapMarkers: () => {
      return dispatch(getMapMarkers());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
