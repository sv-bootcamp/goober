import React, {Component} from 'react';
import Header from '../components/header';

class AppLayout extends Component {
  render() {
    return (
      <div>
        <Header className="header"/>
        <div className="container">
          {this.props.children}
        </div>
        <script src={'/javascripts/main.js'}/>
      </div>
    );
  }
}

AppLayout.propTypes = {
  children: React.PropTypes.node
};

export default AppLayout;
