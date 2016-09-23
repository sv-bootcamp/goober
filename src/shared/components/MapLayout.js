import React, {PropTypes, Component} from 'react';
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
          description: 'Current Location',
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

export default MapLayout;
