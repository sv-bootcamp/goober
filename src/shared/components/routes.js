import React from 'react';
import {Route, IndexRoute} from 'react-router';
import AppContainer from '../containers/app-container';
import IndexContainer from '../containers/index-container';
import HeaderContainer from '../containers/header-container';

import MapLayout from '../components/MapLayout';

export default (
  <Route path="/" component={AppContainer}>
    <IndexRoute component={IndexContainer}/>
    <Route path="map" component={HeaderContainer}>
      <IndexRoute component={MapLayout}/>
    </Route>
  </Route>
);
