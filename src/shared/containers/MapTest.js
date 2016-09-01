import React, {PropTypes, Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import controllable from 'react-controllables';

import GoogleMap from 'google-map-react';
import Marker from '../components/Marker.js';

class MapTest extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = shouldPureComponentUpdate;

    this.onBoundsChange = (center, zoom) => {
      this.props.onCenterChange(center);
      this.props.onZoomChange(zoom);
    };

    this.onChildClick = (key, childProps) => {
      this.props.onCenterChange([childProps.lat, childProps.lng]);
    };

    this.onChildMouseEnter = (key
      /* , childProps */
      ) => {
      this.props.onHoverKeyChange(key);
    };

    this.onChildMouseLeave = (
      /* key, childProps */
      ) => {
      this.props.onHoverKeyChange(null);
    };
  }

  render() {
    const places = this.props.greatPlaces
    .map(place => {
      const {id, ...coords} = place;

      return (
          <Marker key={id} text={id} {...coords} hover={this.props.hoverKey === id} />
      );
    });

    return (
      <section style={{ width: '100%', height: '500px' }}>
        <h4>coords: {this.props.center}</h4>
         <GoogleMap
          center={this.props.center}
          zoom={this.props.zoom}
          hoverDistance={20}
          onBoundsChange={this.onBoundsChange}
          onChildClick={this.onChildClick}
          onChildMouseEnter={this.onChildMouseEnter}
          onChildMouseLeave={this.onChildMouseLeave}
          >
            {places}
        </GoogleMap>
      </section>
    );
  }
}

MapTest.propTypes = {
  center: PropTypes.array,
  // @controllable
  zoom: PropTypes.number,
  // @controllable
  hoverKey: PropTypes.string,
  // @controllable
  clickKey: PropTypes.string,
  // @controllable
  onCenterChange: PropTypes.func,
  // @controllable generated fn
  onZoomChange: PropTypes.func,
  // @controllable generated fn
  onHoverKeyChange: PropTypes.func,
  // @controllable generated fn

  greatPlaces: PropTypes.array
};

MapTest.defaultProps = {
  center: [37.563398, 126.9907941],
  zoom: 15,
  greatPlaces: [
    {id: 'A', lat: 37.563398, lng: 126.9907941},
    {id: 'B', lat: 37.565398, lng: 126.9907941},
    {id: 'C', lat: 37.565398, lng: 126.9987941}
  ],
  onCenterChange: (center) => {
    console.error('center change not defined');
  },
  onZoomChange: (zoom) => {
    console.error('zoom change not defined');
  },
  onHoverKeyChange: (key) => {
    console.error('hover key  not defined');
  }

};

MapTest = controllable(MapTest, ['center', 'zoom', 'hoverKey', 'clickKey']);

export default MapTest;
