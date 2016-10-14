import test from 'tape';
import geohash from 'ngeohash';
import {KeyMaker, STATE, DEFAULT_PRECISON, MAX_TIME, Timestamp, GEOHASH_START_POS, GEOHASH_END_POS,
        REF_GEOHASH_START_POS, STATE_CODE_POS} from '../../../server/items/key-utils';

const mockData = {
  lat: 37.565398,
  lng: 126.9907941,
  dateString: '2016-10-04T04:00:00.578Z',
  dateObject: new Date(),
  precision: DEFAULT_PRECISON
};

test('make STATE.ALIVE key stream', t => {
  const expected = {
    hash: geohash.encode(mockData.lat, mockData.lng, mockData.precision),
    time: MAX_TIME - Number(new Date(mockData.date)),
    type: STATE.ALIVE
  };

  const keyMaker = new KeyMaker(mockData.lat, mockData.lng, mockData.date);
  const uuid = keyMaker.getUuid();
  const keyStream = keyMaker.getKeyStream();
  const itemKey = keyStream[0];

  t.equal(itemKey.slice(GEOHASH_START_POS, GEOHASH_END_POS + 1), expected.hash,
  'should be same geohash');
  t.equal(itemKey.includes(uuid), true,
  'should have same uuid');

  for (let i = 1; i <= mockData.precision; i = i + 1) {
    t.equal(keyStream[i].charAt(STATE_CODE_POS), expected.type, 'should have same type');
    t.equal(keyStream[i].slice(REF_GEOHASH_START_POS, REF_GEOHASH_START_POS + i),
    expected.hash.slice(0, i), 'should have same geohash');
    t.equal(keyStream[i].includes(expected.time), true, 'should have same time');
    t.equal(keyStream[i].includes(uuid), true, 'should have same uuid');
  }

  t.end();
});

test('make timestamp using module', t => {
  const expected = {
    stringResult: MAX_TIME - Number(new Date(mockData.dateString)),
    dateResult: MAX_TIME - Number(mockData.dateObject)
  };
  const stringTS = new Timestamp(mockData.dateString).getTimestamp();
  t.equal(stringTS, expected.stringResult, 'should have same timeStamp(String use)');
  const dateTS = new Timestamp(mockData.dateObject).getTimestamp();
  t.equal(dateTS, expected.dateResult, 'should have same timeStamp(Date use)');
  t.end();
});
