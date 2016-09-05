/**
 * Created by Youngchan Je on 2016-09-05.
 */
import React, {Component} from 'react';

let divStyle = {
  color: 'yellow',
  backgroundColor: 'blue',
  height: '200px',
  width: '100%'
};

class Header extends Component {
  render() {
    return (
      <div style={divStyle}>
        WHAT A GREAT HEADER
      </div>
    );
  }
}

export default Header;
