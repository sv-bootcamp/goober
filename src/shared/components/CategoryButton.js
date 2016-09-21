import React, {PropTypes, Component} from 'react';
import {Button} from 'react-bootstrap';

class CategoryButton extends Component {
  render() {
    return (
      <Button>{this.props.category}</Button>
    );
  }
}

CategoryButton.propTypes = {
  category: PropTypes.string
};

export default CategoryButton;
