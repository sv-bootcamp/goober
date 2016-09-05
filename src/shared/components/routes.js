import React from 'react';
import {Route, IndexRoute} from 'react-router';
import AppContainer from '../containers/app-container';
import IndexContainer from '../containers/index-container';

import MapLayout from '../components/MapLayout';
import header from '../components/header';

export default (
  <Route path="/" component={AppContainer}>
    <IndexRoute component={IndexContainer}/>
    <Route path="map" component={MapLayout}/>
    <Route path="header" component={header}/>
  </Route>
);
