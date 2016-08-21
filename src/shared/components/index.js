import FacebookLogin from 'react-facebook-login';
import moment from 'moment';
import React, {Component} from 'react';
import Config from '../config';

class Index extends Component {
  render() {
    const {
      onFacebookLoad,
      user: {
        accessToken,
        expires,
        name,
        count
      }
    } = this.props;
    const currentTime = moment().format('X');

    if (accessToken === null || currentTime > expires) {
      return (
        <div>
          <FacebookLogin
            appId={Config.fb.appId}
            autoLoad={true}
            fields="name"
            callback={onFacebookLoad}
          />
        </div>
      );
    }
    return (
      <div>
        Hello, {name}. You have visited {count} time{count > 1 ? 's' : ''} today!
      </div>
    );
  }
}

Index.propTypes = {
  onFacebookLoad: React.PropTypes.func,
  user: React.PropTypes.object
};

export default Index;
