import React from 'react';
import {Route, IndexRoute} from 'react-router';
import AppContainer from '../containers/app-container';
import IndexContainer from '../containers/index-container';
import MapLayout from '../components/MapLayout';
import ListLayout from '../components/ListLayout';

export default (
  <Route path="/" component={AppContainer}>
    <IndexRoute component={IndexContainer}/>
    <Route path="map" component={MapLayout}/>
    <Route path="list" component={ListLayout}/>
  </Route>
);
