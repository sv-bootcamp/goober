import test from 'tape';
import {KeyUtils, Timestamp} from '../../server/key-utils';
import {DEFAULT_PRECISON, MAX_TIME} from '../../server/constants';

const mockData = {
  lat: 37.565398,
  lng: 126.9907941,
  dateString: '2016-10-04T04:00:00.578Z',
  dateObject: new Date(),
  precision: DEFAULT_PRECISON
};

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

test('make time reversed', t => {
  const expected = {
    reversedTime: MAX_TIME - Number(new Date(mockData.dateString))
  };
  const reversedTime = KeyUtils.getReversedTime(mockData.dateString);
  t.equal(reversedTime, expected.reversedTime, 'should have same time');
  t.end();
});
