import levelup from 'levelup';
import leveldown from 'leveldown';
import config from 'config';

const db = levelup(config.database, {valueEncoding: 'json'});
export default db;

export const clearDB = (cb) => {
  db.close(() => {
    leveldown.destroy(config.database, (err) => {
      if (err) {
        // error
      }
      db.open(cb);
    });
  });
};

export const initMock = (cb) => {
  const makeTime = (day) => {
    const curTime = new Date();
    return new Date(curTime.setDate(curTime.getDate() + day)).toISOString();
  };
  const MOCK_ITEM_KEYS = [
    'item-0-9q8yy1qj-8523910540005-9130b273-b82e-473b-1234-ead0f190b000',
    'item-0-9q8yy385-8523910540004-9130b273-b82e-473b-1234-ead0f190b001',
    'item-0-9q8yy70q-8523910540003-9130b273-b82e-473b-1234-ead0f190b002',
    'item-0-9q8yy453-8523910540002-9130b273-b82e-473b-1234-ead0f190b003',
    'item-0-9q8yy6bq-8523910540001-9130b273-b82e-473b-1234-ead0f190b004',
    'item-0-9q8yy69f-8523910540000-9130b273-b82e-473b-1234-ead0f190b005'
  ];
  const MOCK_ITEMS = [
    {
      title: 'Lion popup store',
      lat: 37.756787937,
      lng: -122.4233365122,
      address: '310 Dolores St, San Francisco, CA 94110, USA',
      createdDate: makeTime(-1),
      modifiedDate: makeTime(-1),
      category: 'event',
      startTime: makeTime(-1),
      endTime: makeTime(1)
    },
    {
      title: 'Generation Beauty by ipsy 2016',
      lat: 37.7579415,
      lng: -122.4204612,
      address: '600 Guerrero St, San Francisco, CA 94110, United States',
      createdDate: makeTime(-2),
      modifiedDate: makeTime(-2),
      category: 'event',
      startTime: makeTime(-2),
      endTime: makeTime(2)
    },
    {
      title: 'Fatal crash',
      lat: 37.7665825,
      lng: -122.420037,
      address: '1800 Mission St, San Francisco, CA 94103, United States',
      createdDate: makeTime(-3),
      modifiedDate: makeTime(-3),
      category: 'warning',
      startTime: makeTime(-3),
      endTime: makeTime(3)
    },
    {
      title: 'Magnitude 2.5 earthquake',
      lat: 37.7602867,
      lng: -122.4271415,
      address: '19th St & Dolores Street, San Francisco, CA 94114, United States',
      createdDate: makeTime(-4),
      modifiedDate: makeTime(-4),
      category: 'warning',
      startTime: makeTime(-4),
      endTime: makeTime(4)
    },
    {
      title: 'Cafe Free Wifi',
      lat: 37.7652022,
      lng: -122.4201257,
      address: '2500 17th St, San Francisco, CA 94110, United State',
      createdDate: makeTime(-5),
      modifiedDate: makeTime(-5),
      category: 'facility',
      startTime: makeTime(-5),
      endTime: makeTime(5)
    },
    {
      title: 'Union Square Public Toilet',
      lat: 37.7632684,
      lng: -122.4182374,
      address: '2295 Harrison St, San Francisco, CA 94110, United States',
      createdDate: makeTime(-6),
      modifiedDate: makeTime(-6),
      category: 'facility',
      startTime: makeTime(-6),
      endTime: makeTime(6)
    }
  ];
  const ops = [
      {type: 'put', key: MOCK_ITEM_KEYS[0], value: MOCK_ITEMS[0] },
      {type: 'put', key: MOCK_ITEM_KEYS[1], value: MOCK_ITEMS[1] },
      {type: 'put', key: MOCK_ITEM_KEYS[2], value: MOCK_ITEMS[2] },
      {type: 'put', key: MOCK_ITEM_KEYS[3], value: MOCK_ITEMS[3] },
      {type: 'put', key: MOCK_ITEM_KEYS[4], value: MOCK_ITEMS[4] },
      {type: 'put', key: MOCK_ITEM_KEYS[5], value: MOCK_ITEMS[5] }
  ];
  db.batch(ops, (err) => {
    if (err) {
      return cb(new Error(err));
    }
    return cb();
  });
};
