import test from 'tape';
import geohash from 'ngeohash';
import {KeyMaker, ALIVE, DEFAULT_PRECISON, MAX_TIME} from '../../../server/items/models';

const mockData = {
  lat: 37.565398,
  lng: 126.9907941,
  date: '2016-10-04T04:00:00.578Z',
  precision: DEFAULT_PRECISON
};

test('make alive key stream', t => {
  const expected = {
    geohash: geohash(mockData.lat, mockData.lng, mockData.precision),
    time: MAX_TIME - Number(new Date(mockData.date)),
    type: ALIVE
  };

  const keyMaker = KeyMaker(expected.lat, expected.lng, expected.date);
  const uuid = keyMaker.getUuid();
  const keyStream = keyMaker.getKeyStream();
  const itemKey = keyStream[0];

  t.equal(expected.geohash, itemKey.slice(5, 13), 'should be same geohash');
  t.equal(true, itemKey.includes(uuid), 'should have same uuid');

  for (let i = 1; i <= mockData.precision; i = i + 1) {
    t.equal(expected.type, keyStream[i].slice(5, 6), 'should have same type');
    t.equal(expected.geohash, keyStream[i].slice(7, 15), 'should have same geohash');
    t.equal(true, keyStream[i].includes(expected.time), 'should have same time');
    t.equal(true, keyStream[i].includes(uuid), 'should have same uuid');
  }
  t.end();
});
