import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { addCard } from '../actions/cardList';

let AddCard = ({ dispatch }) => {
  let input;

  return (
		<div>
      <form onSubmit={e => {
        e.preventDefault();
        if (!input.value.trim()) {
          return;
        }
        dispatch(addCard(input.value));
        input.value = '';
      }}>
        <input ref={node => {
          input = node;
        }} />
        <button type="submit">
          Add Card Man
        </button>
      </form>
    </div>
	);
};

AddCard.propTypes = {
  dispatch: PropTypes.func
};

AddCard = connect()(AddCard);

export default AddCard;
