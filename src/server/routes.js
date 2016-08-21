import express from 'express';
import Logger from 'node-simple-logger';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {RouterContext, match} from 'react-router';
import {Provider} from 'react-redux';
import routes from '../shared/components/routes';
import store from '../shared/store';
import renderPage from './render-page';

const router = express.Router();

/**
 * The server side-rendering works but there are caveats when rendering from dynamic data
 * using the new version of react-router.
 * Main reason: it doesn't seem to pass mutated routeInfos (renderProps).
 * This bug is a good oportunity to setup some flux-like implementation,
 * in order to have clearer management of state.
 */
router.get('/*', (req, res, next) => {
  match({routes, location: req.url}, (err, redirectLocation, renderProps) => {
    if (err) {
      Logger.debug(`[ReactRouter][Error] ${req.url}, ${err.message}`);
      return next(err);
    }
    if (redirectLocation) {
      Logger.debug(`[ReactRouter][Redirection] ${req.url}, 
                ${redirectLocation.pathname}, ${redirectLocation.search}`);
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }
    if (renderProps) {
      Logger.debug(`[ReactRouter][Found] ${req.url}`);
      const html = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps}/>
        </Provider>
      );
      const state = JSON.stringify(store.getState());
      const page = renderPage(html, state);

      return res.send(page);
    }
    // TODO: correctly render errors
    Logger.info(`[ReactRouter][Not Found], ${req.url}`);
    const error404 = new Error('Not Found');
    error404.status = 404;
    return next(error404);
  });
});

/* if no route matched, redirect home */
router.get('/*', (req, res) => {
  res.send('not found');
});

export default router;
