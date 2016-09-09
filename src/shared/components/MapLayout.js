import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import { getMapMarkers } from '../actions/map';
import MapBlock from './MapBlock.js';

class MapLayout extends Component {

  componentDidMount() {
    this.props.getMapMarkers().then(
      () => {
        // console.log('dd:' + this.props.status + '/' + JSON.stringify(this.props.markers.data));
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

MapLayout.propTypes = {
  status: PropTypes.string,
  markers: PropTypes.object,
  getMapMarkers: PropTypes.func
};

MapLayout.defaultProps = {

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

export default connect(mapStateToProps, mapDispatchToProps)(MapLayout);
