/**
 * Created by Youngchan Je on 2016-09-05.
 */
import React, {Component} from 'react';
import CategoryButton from './CategoryButton';
import {Button} from 'react-bootstrap';

const divStyle = {
  color: 'yellow',
  backgroundColor: 'blue',
  height: '200px',
  width: '100%'
};

class Header extends Component {
  render() {
    return (
      <div style={divStyle}>
        <CategoryButton category={'A'}/>
        <CategoryButton category={'B'}/>
        <Button href='/map'>Map</Button>
        <Button href='/list'>List</Button>
      </div>
    );
  }
}

export default Header;
