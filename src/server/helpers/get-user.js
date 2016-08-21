import Cache from 'memory-cache';
import {FB} from 'fb';
import moment from 'moment';
import Config from '../../shared/config';

FB.options({
  version: Config.fb.version,
  appId: Config.fb.appId,
  appSecret: process.env.FB_APP_SECRET || Config.fb.appSecret
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
    res.send({
      name: response.name,
      count: getCount(response.id)
    });
  });
};
