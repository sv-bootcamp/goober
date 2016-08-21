import {connect} from 'react-redux';
import Index from '../components/index';
import getUserAction from '../actions/get-user';

const mapDispatchToProps = {
  onFacebookLoad: getUserAction
};

// Utilizing mapStateToProps allows the container component to be rendered with props
// that come from the application store (read state).
function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
