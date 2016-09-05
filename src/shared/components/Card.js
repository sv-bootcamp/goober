import React, {PropTypes} from 'react';

const Card = ({text}) => (
  <li>
    {text}
  </li>
)

Card.propTypes = {
  text: PropTypes.string
}

export default Card;