import React, {PropTypes, Component} from 'react';
import Card from './Card';

class CardList extends Component {
  render() {
    return (
      <div>
        <ul>
          {this.props.cards.map(card =>
            <Card
              {...card}/>
          )}
        </ul>
      </div>
    );
  }
}

CardList.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string
  })),
  onCardClick: PropTypes.func
};

export default CardList;
