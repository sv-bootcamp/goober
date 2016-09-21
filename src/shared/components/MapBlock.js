import React, {PropTypes, Component} from 'react';
import controllable from 'react-controllables';
import GoogleMap from 'google-map-react';
import Marker from './Marker.js';
import CategorizedCardList from '../containers/CategorizedCardList';

class MapBlock extends Component {
  constructor(props) {
    super(props);
    this.onBoundsChange = this.onBoundsChange.bind(this);
    this.onChildClick = this.onChildClick.bind(this);
    this.onChildMouseEnter = this.onChildMouseEnter.bind(this);
    this.onChildMouseLeave = this.onChildMouseLeave.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onBoundsChange(center, zoom) {
    this.props.onCenterChange(center);
    this.props.onZoomChange(zoom);
  }

  // onChange(center, zoom, bounds) {
    // this.props.setMapProps(center, zoom, bounds);
  // }

  onChildClick(key, childProps) {
    this.props.onCenterChange([childProps.lat, childProps.lng]);

    this.props.onSelectMarker(key, childProps);
  }

  onChildMouseEnter(key, childProps) {
    const markerId = childProps.id;
    const index = this.props.markers.findIndex(marker => marker.id === markerId);
    if(this.props.onMarkerHover) {
      this.props.onMarkerHover(index);
    }
  }

  onChildMouseLeave() {
    if(this.props.onMarkerHover) {
      this.props.onMarkerHover(-1);
    }
  }

  render() {
    const markers = this.props.markers
    .map(marker => {      
      const {id, description, ...coords} = marker;

      return (
        <Marker
        key={id}
        description={description}
        {...coords} />
      );
    });

    return (
      <section style={{ width: '100%', height: '500px' }}>
        <h4>coords: {this.props.center}</h4>
        <GoogleMap
          bootstrapURLKeys={{
            key: "AIzaSyAIuVNkpDRHj480nQcjkWsBSj_kHmW2AZU"
          }}
          center={this.props.center}
          zoom={this.props.zoom}
          onBoundsChange={this.onBoundsChange}
          onChange={this.onChange}
          onChildClick={this.onChildClick}
          onChildMouseEnter={this.onChildMouseEnter}
          onChildMouseLeave={this.onChildMouseLeave}
          hoverDistance={20}
          >
        {markers}
      </GoogleMap>
      <CategorizedCardList />
      </section>
    );
  }
}

MapBlock.propTypes = {
  onCenterChange: PropTypes.func,
  onZoomChange: PropTypes.func,
  onBoundsChange: PropTypes.func,
  onMarkerHover: PropTypes.func,
  onChildClick: PropTypes.func,
  onChange: PropTypes.func,
  center: PropTypes.any,
  zoom: PropTypes.number,
  onSelectMarker: PropTypes.func,  
  markers: PropTypes.any
};

MapBlock.defaultProps = {
  center: [37.563398, 126.9907941],
  zoom: 15,
  markers: [
    {id: 'A', lat: 37.563398, lng: 126.9907941},
    {id: 'B', lat: 37.565398, lng: 126.9907941},
    {id: 'C', lat: 37.565398, lng: 126.9987941}
  ]
};

MapBlock = controllable(MapBlock, ['center', 'zoom', 'markers']);

export default MapBlock;
