import config from 'config';
import Cache from 'memory-cache';
import {FB} from 'fb';
import moment from 'moment';

const {
  fb: {
    version,
    appId,
    appSecret
  }
} = config;

FB.options({
  version,
  appId: process.env.FB_APP_ID || appId,
  appSecret: process.env.FB_APP_SECRET || appSecret
});

const getCount = (id) => {
  const date = moment().toISOString().split('T')[0];
  const key = `${date}-${id}`;
  const count = (Cache.get(key) || 0) + 1;

  Cache.put(key, count, 86400000);
  return count;
};

export default (accessToken, res) => {
  FB.setAccessToken(accessToken);
  FB.api('me', (response) => {
    if (response.error && response.error.type === 'OAuthException') {
      res.status(401).send('Invalid Access Token');
      return;
    }
    res.send({
      name: response.name,
      count: getCount(response.id)
    });
  });
};
