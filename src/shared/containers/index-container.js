import {connect} from 'react-redux';
import Index from '../components/index';
import getUserAction from '../actions/get-user';

const mapDispatchToProps = {
  getUser: getUserAction
};

// Utilizing mapStateToProps allows the container component to be rendered with props
// that come from the application store (read state).
const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
