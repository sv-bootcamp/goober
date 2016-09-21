import React, {PropTypes, Component} from 'react';
import { Motion, spring } from 'react-motion';

class Marker extends Component {
  render() {    
    const initMotionStyle = {
      scale: this.props.$prerender ? this.props.defaultScale : this.props.initialScale
    };

    const motionStyle = {
      scale: spring(
        this.props.$hover ? this.props.hoveredScale : this.props.defaultScale, 320, 7, 0.001
      )
    };    

    return (
      <Motion defaultStyle={initMotionStyle} style={motionStyle}>
        {
          ({ scale }) => (
            <div className="marker" style=
              {{transform: `translate3D(0,0,0) scale(${scale}, ${scale})`}}>
              <div>{this.props.description}</div>
            </div>
          )
        }
      </Motion>
    );
  }
}

Marker.propTypes = {
  $hover: PropTypes.bool,
  $prerender: PropTypes.bool,
  initialScale: PropTypes.number,
  defaultScale: PropTypes.number,
  hoveredScale: PropTypes.number,
  description: PropTypes.string
};

Marker.defaultProps = {
  initialScale: 0.4,
  defaultScale: 0.9,
  hoveredScale: 1.1
};

export default Marker;
