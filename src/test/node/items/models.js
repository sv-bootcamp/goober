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
    hash: geohash.encode(mockData.lat, mockData.lng, mockData.precision),
    time: MAX_TIME - Number(new Date(mockData.date)),
    type: ALIVE.toString()
  };

  const keyMaker = new KeyMaker(mockData.lat, mockData.lng, mockData.date);
  const uuid = keyMaker.getUuid();
  const keyStream = keyMaker.getKeyStream();
  const itemKey = keyStream[0];

  t.equal(itemKey.slice(5, 13), expected.hash, 'should be same geohash');
  t.equal(itemKey.includes(uuid), true, 'should have same uuid');

  for (let i = 1; i <= mockData.precision; i = i + 1) {
    t.equal(keyStream[i].slice(5, 6), expected.type, 'should have same type');
    t.equal(keyStream[i].slice(7, 7 + i), expected.hash.slice(0, i), 'should have same geohash');
    t.equal(keyStream[i].includes(expected.time), true, 'should have same time');
    t.equal(keyStream[i].includes(uuid), true, 'should have same uuid');
  }

  t.end();
});
