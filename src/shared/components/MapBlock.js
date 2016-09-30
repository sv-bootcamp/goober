import React, {PropTypes, Component} from 'react';
import controllable from 'react-controllables';
import GoogleMap from 'google-map-react';
import Marker from './Marker.js';
import CategorizedCardList from '../containers/CategorizedCardList';

class MapBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapProps: null
    };

    this.onBoundsChange = this.onBoundsChange.bind(this);
    this.onChildClick = this.onChildClick.bind(this);
    this.onChildMouseEnter = this.onChildMouseEnter.bind(this);
    this.onChildMouseLeave = this.onChildMouseLeave.bind(this);
  }

  onBoundsChange(center, zoom) {
    this.props.onCenterChange(center);
    this.props.onZoomChange(zoom);
  }

  onChildClick(key, childProps) {
    this.props.onCenterChange([childProps.lat, childProps.lng]);

    this.props.onSelectMarker(key, childProps);
  }

  onChildMouseEnter(key, childProps) {
    const markerId = childProps.id;
    const index = this.props.markers.findIndex(marker => marker.id === markerId);
    if (this.props.onMarkerHover) {
      this.props.onMarkerHover(index);
    }
  }

  onChildMouseLeave() {
    if (this.props.onMarkerHover) {
      this.props.onMarkerHover(-1);
    }
  }

  render() {
    // const clusters = supercluster(this.props.markers,
    // {minZoom: 3, maxZoom:15, radius: this.props.clusterRadius});
    // let rc = [];
    // if(this.state.mapProps){
    //   console.log("sd:"+this.state.mapProps);
    //   rc = clusters(this.state.mapProps);
    //   rc.map(({wx, wy, numPoints, points}) => {
    //     const {lat,lng,text} = {wy, wx, numPoints};
    //     const id = `${numPoints}_${points[0].id}`;

    //     return (
    //       <Marker
    //       key={id}
    //       description={text}
    //       lat={lat}
    //       lng={lng}/>
    //     );
    //   });
    // }
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
            key: 'AIzaSyAIuVNkpDRHj480nQcjkWsBSj_kHmW2AZU'
          }}
          center={this.props.center}
          zoom={this.props.zoom}
          onBoundsChange={this.onBoundsChange}
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
  center: PropTypes.any,
  zoom: PropTypes.number,
  onSelectMarker: PropTypes.func,
  markers: PropTypes.any,
  clusterRadius: PropTypes.number,
  mapProps: PropTypes.object
};

MapBlock.defaultProps = {
  center: [37.563398, 126.9907941],
  zoom: 15,
  markers: [
    {id: 'A', lat: 37.563398, lng: 126.9907941},
    {id: 'B', lat: 37.565398, lng: 126.9907941},
    {id: 'C', lat: 37.565398, lng: 126.9987941}
  ],
  clusterRadius: 60
};

MapBlock = controllable(MapBlock, ['center', 'zoom', 'markers']);

export default MapBlock;
