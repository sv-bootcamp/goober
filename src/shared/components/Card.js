import React, {PropTypes} from 'react';

const Card = ({text}) => (
  <li>
    {text}
  </li>
);

Card.propTypes = {
  id: PropTypes.number,
  text: PropTypes.string
};

export default Card;
