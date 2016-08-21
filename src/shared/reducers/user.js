import reduceReducers from 'reduce-reducers';
import request from 'sync-request';
import moment from 'moment';

const defaultState = {
  accessToken: null,
  count: -1,
  expires: -1,
  name: null
};

export default reduceReducers(
  (state = defaultState, action) => {
    switch (action.type) {
    case 'GET_USER_REQUEST':
      const currentTime = moment().format('X');
      const {accessToken, expiresIn} = action;
      const {expires} = state;

      if (currentTime > expires) {
        const url = `${location.protocol}//${location.host}/user`;
        const response = request('GET', url, {
          qs: {accessToken}
        });
        if (response.statusCode === 200) {
          const user = JSON.parse(response.body);
          return {
            accessToken: accessToken,
            count: user.count,
            expires: moment().add(expiresIn, 'seconds').format('X'),
            name: user.name
          };
        }
      }
      break;
    default:
      return state;
    }
    return state;
  }
);
