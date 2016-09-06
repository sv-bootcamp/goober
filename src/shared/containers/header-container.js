/**
 * Created by Youngchan Je on 2016-09-05.
 */
import React from 'react';
import {connect} from 'react-redux';
import Header from '../components/header';

const App = ({children}) => {
  return (
    <div>
      <Header/>
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
