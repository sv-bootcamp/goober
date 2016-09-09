import React, {PropTypes, Component} from 'react';
import { addCard } from '../actions/cardList';

class AddCardForm extends Component {
  render() {
    let input;

    return (
      <div>
        <form onSubmit={e => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }
          this.props.dispatch(addCard(input.value));
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
  }
}

AddCardForm.propTypes = {
  dispatch: PropTypes.func
};

export default AddCardForm;
