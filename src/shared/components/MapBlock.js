import React, {PropTypes, Component} from 'react';
import controllable from 'react-controllables';

import GoogleMap from 'google-map-react';
import Marker from './Marker.js';
import CardList from './CardList.js';
import update from 'react-addons-update';

class MapBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numOfClicked : 0,
      cards : []
    }
    this.onBoundsChange = this.onBoundsChange.bind(this);
    this.onChildClick = this.onChildClick.bind(this);
    this.mapClick = this.mapClick.bind(this);
  }

  onBoundsChange(center, zoom) {
    this.props.onCenterChange(center);
    this.props.onZoomChange(zoom);
  }

  onChildClick(key, childProps) {
    this.props.onCenterChange([childProps.lat, childProps.lng]);

    this.props.onSelectMarker(key, childProps);
  }

  mapClick(){
    this.setState({
      numOfClicked : this.state.numOfClicked+1,
      cards: update(this.state.cards, { $push: [{text : "card" + this.state.numOfClicked}]})
    })
    //let string = "card" + this.state.numOfClicked;
    console.log(JSON.stringify(this.state.cards))
  }

  cardClick(i){
    console.log(i);
    this.setState({
      cards: update(this.state.cards,
        { $splice: [[i, 1]]}
      )
    });
  }

  render() {
    const markers = this.props.markers
    .map(marker => {
      const {id, ...coords} = marker;

      return (
        <Marker
        key={id}
        text={id}
        {...coords} />
      );
    });

    return (
      <section style={{ width: '100%', height: '500px' }}>
        <h4>coords: {this.props.center}</h4>
        <GoogleMap
          center={this.props.center}
          zoom={this.props.zoom}
          onBoundsChange={this.onBoundsChange}
          onChildClick={this.onChildClick}
          hoverDistance={20}
          onClick = {this.mapClick}>
        {markers}
      </GoogleMap>
      <CardList
        cards = {this.state.cards}
        cardClick = {this.cardClick}/>
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
  markers: PropTypes.any,
  onSelectMarker: PropTypes.func
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
