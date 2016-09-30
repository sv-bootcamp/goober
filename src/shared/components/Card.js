import React, {PropTypes, Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Card extends Component {
  constructor(props) {
    super(props);
    this.handleMove = this.handleMove.bind(this);
  }

  handleMove() {
  }

  handleStar() {
  }

  render() {
    return (
      <ReactCSSTransitionGroup transitionName="animstart" transitionAppear={true}
      transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
        <section key={1} className='mapcard'
          onClick={this.handleMove}>
          <h3>{this.props.thisData.description}</h3>
          <h5>{this.props.thisData.address}</h5>
          <h5>{this.props.thisData.eventtime}</h5>
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

Card.propTypes = {
  id: PropTypes.string,
  thisData: PropTypes.object,
  onClick: PropTypes.func
};

export default Card;
