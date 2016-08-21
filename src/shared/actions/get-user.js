export default (response) => {
  return {
    type: 'GET_USER_REQUEST',
    accessToken: response.accessToken,
    expiresIn: response.expiresIn
  };
};
