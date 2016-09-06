import React, {PropTypes} from 'react';
import Card from './Card'


const CardList = ({cards}, {cardClick}) => (
  <div>
    <ul>
      {cards.map((card, i) =>
        <Card
          text={card.text}
          key = {i}
          onClick = {()=>cardClick(i)}
        />
      )}
    </ul>
  </div>
)

CardList.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string
  })),
  cardClick: PropTypes.func
}

CardList.defaultProps = {
  cards: [
    {text: 'card1'},
    {text: 'card2'},
    {text: 'card3'}
  ]
}

export default CardList;
