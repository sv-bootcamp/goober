import config from 'config';
import Cache from 'memory-cache';
import {FB} from 'fb';
import moment from 'moment';

const {
  fb: {
    version
  }
} = config;

const getCount = (id) => {
  const date = moment().toISOString().split('T')[0];
  const key = `${date}-${id}`;
  const count = (Cache.get(key) || 0) + 1;

  Cache.put(key, count, 86400000);
  return count;
};

FB.options({
  version
});

export default {
  get: (accessToken, res, fb = FB) => {
    fb.setAccessToken(accessToken);
    fb.api('me', (response) => {
      if (response.error && response.error.type === 'OAuthException') {
        res.status(401).send('Invalid Access Token');
        return;
      }
      res.json({
        name: response.name,
        count: getCount(response.id)
      });
    });
  }
};
