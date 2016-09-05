import React, {Component} from 'react';
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
			<ReactCSSTransitionGroup transitionName="animStart" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
				<section key={1} style={{ position: 'absolute', background: '#fff', bottom: '100px', width: '500px', height: '300px'}} onClick={this.handleMove}>				
					<h3>Lion popup store</h3>
					<h5>14 Mission St.Palo Alto, CA</h5>
					<h5>11:00 am - 4:00 pm</h5>
					<div className='footer'>
						<div className='numPhotos'>18</div>
						<div className='timeago'>4 mins ago</div>
						<div className='distance'>106m</div>
					</div>
					<i className="material-icons star icon-button" onClick={this.handleStar}>star</i>
				</section>
			</ReactCSSTransitionGroup>
		);
	}
}

export default MapCard;