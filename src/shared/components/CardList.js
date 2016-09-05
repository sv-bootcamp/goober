import React, {PropTypes} from 'react';
import Card from './Card'

const CardList = ({cards}) => (
  <div>
    <ul>
      {cards.map(card =>
        <Card
          text={card.text}
        />
      )}
    </ul>
  </div>
)

CardList.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string
  }))
}

CardList.defaultProps = {
  cards: [
    {text: 'card1'},
    {text: 'card2'},
    {text: 'card3'}
  ]
}

export default CardList;