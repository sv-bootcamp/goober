import config from 'config';

export default (html, initialState) => {
  return `
<!doctype html>
<html lang="utf-8">
  <head>
    <link rel="shortcut icon" href="/static/favicon.ico">
    <title>${config.name}</title>
  </head>
  <body>
    <div id="app-container">${html}</div>
    <script>window.$REDUX_STATE = ${initialState}</script>
  </body>
</html>
`;
};
