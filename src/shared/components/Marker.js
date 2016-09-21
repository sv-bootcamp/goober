import React, {PropTypes, Component} from 'react';
import {markerStyle, markerStyleHover} from './marker-style.js';

class Marker extends Component {
  render() {
    const style = this.props.$hover ? markerStyleHover : markerStyle;

    return (
      <div className="" style={style}>
        <div>{this.props.description}</div>
      </div>
    );
  }
}

Marker.propTypes = {
  $hover: PropTypes.bool,
  description: PropTypes.string
};

Marker.defaultProps = {};

export default Marker;
