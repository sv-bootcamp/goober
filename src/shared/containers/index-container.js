import {connect} from 'react-redux';
import Index from '../components/index';

const mapDispatchToProps = {
  // TBD
};

// Utilizing mapStateToProps allows the container component to be rendered with props
// that come from the application store (read state).
const mapStateToProps = () => ({
  // TBD
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
