import config from 'config';
import FacebookLogin from 'react-facebook-login';
import React, {Component} from 'react';

class Index extends Component {
  constructor() {
    super();
    this.onFacebookLoad = this.onFacebookLoad.bind(this);
  }

  onFacebookLoad(response) {
    const {accessToken} = response;
    const {
      getUser,
      user: {
        name
      }
    } = this.props;

    if (name === null) {
      getUser(accessToken);
    }
  }

  render() {
    const {
      user: {
        accessToken,
        name,
        count
      }
    } = this.props;

    if (accessToken === null) {
      return (
        <div>
          <FacebookLogin
            appId={process.env.FB_APP_ID || config.get('Client.fb.appId')}
            autoLoad={true}
            fields="name"
            callback={this.onFacebookLoad}
          />
        </div>
      );
    }

    if (typeof name === 'undefined') {
      return (
        <div className="error">
          Server-side authentication failed. Please check with administrator.
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
  getUser: React.PropTypes.func,
  user: React.PropTypes.object
};

export default Index;
