import React, {PropTypes, Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import {markerStyle, markerStyleHover} from './marker-style.js';

class Marker extends Component {    
  
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = shouldPureComponentUpdate;
  }

  render() {
     const style = this.props.$hover ? markerStyleHover : markerStyle;

    return (
       <div className="" style={style}>
          <div>{this.props.text}</div>          
       </div>
    );
  }
}

Marker.propTypes = {
  $hover: PropTypes.bool,
  text: PropTypes.string
};

Marker.defaultProps = {};

export default Marker;