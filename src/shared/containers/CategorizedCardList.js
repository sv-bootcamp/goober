import { connect } from 'react-redux';
import CardList from '../components/CardList';
import { addCard } from '../actions/cardList';

const mapStateToProps = (state) => {
  return {
    cards: state.cards.cards
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCardClick: () => {
      dispatch(addCard());
    }
  };
};

const CategorizedCardList = connect(
	mapStateToProps,
	mapDispatchToProps
)(CardList);

export default CategorizedCardList;
