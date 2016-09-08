import React, {PropTypes, Component} from 'react';

class Card extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
			<li>
				{this.props.text}
			</li>
		);
  }
}

Card.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func
};

export default Card;
