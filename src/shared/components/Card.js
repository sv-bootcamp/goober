import React, {PropTypes} from 'react';

const Card = ({text, onClick}) => (
  <li
  	onClick={onClick}>
    {text}
  </li>
);

Card.propTypes = {
  id: PropTypes.number,
  text: PropTypes.string,
  onClick: PropTypes.func
};

export default Card;
