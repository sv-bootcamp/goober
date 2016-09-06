import React, {PropTypes} from 'react';
import Card from './Card';

const CardList = ({cards}) => (
  <div>
    <ul>
      {cards.map(card =>
        <Card
          {...card}/>
      )}
    </ul>
  </div>
);

CardList.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string
  }))
};

export default CardList;
