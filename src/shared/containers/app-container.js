import React from 'react';
import {connect} from 'react-redux';

const App = ({children}) => {
  return (
    <div>
      <div className="container">
        {children}
      </div>
      <script src={'/javascripts/main.js'}/>
    </div>
  );
};

App.propTypes = {
  children: React.PropTypes.node
};

export default connect(state => state)(App);
