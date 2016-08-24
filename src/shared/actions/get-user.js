import request from 'request';

export default (accessToken) => (dispatch, getState) => {
  const url = `${location.protocol}//${location.host}/user`;
  request.get({
    url,
    qs: {accessToken},
    json: true
  }, function (error, response, user) {
    if (response.statusCode === 200) {
      const {count, name} = user;
      const payload = {accessToken, count, name};

      dispatch({
        type: 'GET_USER_SUCCESS',
        payload
      });
      return;
    }
    const payload = Object.assign({
      accessToken
    }, getState());

    dispatch({
      type: 'GET_USER_FAILURE',
      payload
    });
  });
};
