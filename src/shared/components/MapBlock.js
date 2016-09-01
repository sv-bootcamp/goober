import React, {PropTypes, Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import controllable from 'react-controllables';

import GoogleMap from 'google-map-react';
import Marker from './Marker.js';

class MapBlock extends Component {	  	

  	constructor(props) {
    	super(props);

    	this.shouldComponentUpdate = shouldPureComponentUpdate;

    	this._onBoundsChange = (center, zoom, bounds, marginBounds) => {  		
		    this.props.onCenterChange(center);
		    this.props.onZoomChange(zoom);	    
	  	}

	  	this._onChildClick = (key, childProps) => {
	  		this.props.onCenterChange([childProps.lat, childProps.lng]);
		}

		this._onChildMouseEnter = (key, childProps) => {
			
		}	

		this._onChildMouseLeave = (/* key, childProps */) => {
			
		}
  	}  	

	render() {
		const markers = this.props.markers
			.map(marker => {
				const {id, ...coords} = marker;
				
				return(
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
					onBoundsChange={this._onBoundsChange}
					onChildClick={this._onChildClick}
					onChildMouseEnter={this._onChildMouseEnter}
					onChildMouseLeave={this._onChildMouseLeave}
					hoverDistance={20}>
					{markers}
				</GoogleMap>
			</section>
		);
	}

}

MapBlock.propTypes = {
	onCenterChange: PropTypes.func, // @controllable generated fn
	onZoomChange: PropTypes.func, // @controllable generated fn
	onBoundsChange: PropTypes.func,
	onMarkerHover: PropTypes.func,
	onChildClick: PropTypes.func,
	center: PropTypes.any,
	zoom: PropTypes.number,
	markers: PropTypes.any
}

MapBlock.defaultProps = {
	center: [37.563398, 126.9907941],
	zoom: 15,
	markers: [
      {id: 'A', lat: 37.563398, lng: 126.9907941},
      {id: 'B', lat: 37.565398, lng: 126.9907941},
      {id: 'C', lat: 37.565398, lng: 126.9987941}
    ]    	
}

MapBlock = controllable(MapBlock, ['center', 'zoom', 'markers']);

export default MapBlock;