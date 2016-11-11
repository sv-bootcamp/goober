import request from 'request-promise';
import config from 'config';

const FACEBOOK_BASE_URL = 'https://graph.facebook.com';
const FACEBOOK_USER_PROFILE_URL = '/me';
const FACEBOOK_PROFILE_IMAGE_URL = '/picture';

const FacebookManager = {
  getProfile: (accessToken) => {
    return request({
      uri: `${FACEBOOK_BASE_URL}${FACEBOOK_USER_PROFILE_URL}`,
      qs: {
        fields: 'name,email,verified',
        access_token: accessToken
      },
      json: true
    });
  },
  getId: (accessToken) => {
    return FacebookManager.getProfile(accessToken)
      .then(profile => {
        return profile.id;
      });
  },
  getProfileImage: (id) => {
    return request({
      uri: `${FACEBOOK_BASE_URL}/${id}${FACEBOOK_PROFILE_IMAGE_URL}`,
      qs: { type: 'large', redirect: 0 },
      json: true
    }).then(imageData => {
      return imageData.data.url;
    });
  },
  getTestAccessToken: () => {
    const APP_ID = process.env.FACEBOOK_APP_ID || config.FACEBOOK_APP_ID;
    const APP_ACCESS_TOKEN = process.env.FACEBOOK_APP_ACCESS_TOKEN
      || config.FACEBOOK_APP_ACCESS_TOKEN;
    return request({
      uri: `${FACEBOOK_BASE_URL}/v2.8/${APP_ID}/accounts/test-users`,
      qs: { access_token: APP_ACCESS_TOKEN },
      json: true
    })
      .then(res => {
        return res.data[0].access_token;
      });
  }
};

export default FacebookManager;
