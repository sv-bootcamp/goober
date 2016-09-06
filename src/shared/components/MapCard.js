import React, {PropTypes, Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// import TimeAgo from 'react-timeago';

class MapCard extends Component {

	constructor(props) {
		super(props);

		this.handleMove = this.handleMove.bind(this);
	}

	handleMove() {
		console.log("move");
	}

	handleStar() {
		console.log("handleStar");
	}

	render() {

		return (
			<ReactCSSTransitionGroup transitionName="animstart" transitionAppear={true} 
			transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
				<section key={1} className='mapcard'					
					onClick={this.handleMove}>				
					<h3>{this.props.thisData.title}</h3>
					<h5>14 Mission St.Palo Alto, CA</h5>
					<h5>11:00 am - 4:00 pm</h5>
					<div className='footer'>
						<div className='leftFooter'>
							<div className='numPhotos'>18</div>							
						</div>
						<div className='rightFooter'>
							<div className='timeago'>4 mins ago</div>
							<div className='distance'>106m</div>
						</div>
					</div>
					<i className="material-icons star icon-button" onClick={this.handleStar}>star</i>
				</section>
			</ReactCSSTransitionGroup>
		);
	}
}

MapCard.propTypes = {
	thisData: PropTypes.object,
	onSelectMarker: PropTypes.func
};

MapCard.defaultProps = {
	thisData: {}
};

export default MapCard;