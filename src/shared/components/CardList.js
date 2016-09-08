import React, {PropTypes} from 'react';
import Card from './Card';

const CardList = ({cards, onCardClick}) => (
  <div>
    <ul>
      {cards.map(card =>
        <Card
          onClick={() => onCardClick()}
          {...card}/>
      )}
    </ul>
  </div>
);

CardList.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string
  })),
  onCardClick: PropTypes.func
};

export default CardList;
