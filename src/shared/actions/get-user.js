import request from 'sync-request';

export default (accessToken) => (dispatch, getState) => {
  const url = `${location.protocol}//${location.host}/user`;
  const response = request('GET', url, {
    qs: {accessToken}
  });

  if (response.statusCode === 200) {
    const user = JSON.parse(response.body);
    const {count, name} = user;
    const payload = {accessToken, count, name};

    dispatch({
      type: 'GET_USER_SUCCESS',
      payload
    });
    return;
  }
  dispatch({
    type: 'GET_USER_FAILURE',
    payload: Object.assign({
      accessToken
    }, getState())
  });
};
