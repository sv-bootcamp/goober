import geohash from 'ngeohash';
import uuid from 'uuid4';
import {MAX_TIME, DEFAULT_PRECISON, STATE, DELIMITER_NUM_IN_KEY,
        TIMEHASH_LENGTH} from './constants';
export class Timestamp {
  constructor(date) {
    this.timeStamp = MAX_TIME - Number(new Date(date));
  }
  getTimestamp() {
    return this.timeStamp;
  }
}
export const KeyUtils = {
  isOriginKey: (key) => {
    return ((key.match(/-/g) || []).length === DELIMITER_NUM_IN_KEY) ? true : false;
  },
  parseTimeHash: (key) => {
    return key.substring(key.length - TIMEHASH_LENGTH, key.length);
  },
  getReversedTime: (time = new Date()) => {
    return MAX_TIME - Number(new Date(time));
  },
  genTimeHash: (time) => {
    const reversedTime = KeyUtils.getReversedTime(time);
    const uuidKey = uuid();
    return `${reversedTime}-${uuidKey}`;
  },
  getIdxKey: (entity, timeHash, ...options) => {
    // in options, larger notion should came first
    // ex) item, image
    let key = `${entity}-${STATE.ALIVE}`;
    options.map((option) => {
      key = `${key}-${option}`;
    });
    return `${key}-${timeHash}`;
  },
  getIdxKeys: (lat, lng, timeHash, state = STATE.ALIVE) => {
    const keys = [];
    for (let i = 1; i <= DEFAULT_PRECISON; i = i + 1) {
      keys.push(`item-${state}-${geohash.encode(lat, lng, i)}-${timeHash}`);
    }
    return keys;
  },
  getPrefix: (entity, state, ...options) => {
    // in options, high rank entity should come first
    // ex) item, image
    let key = `${entity}-${state}`;
    options.map((option) => {
      key = `${key}-${option}`;
    });
    return key;
  },
  getKeysByArea: (lat, lng, precision) => {
    const centerGeohash = geohash.encode(lat, lng, precision);
    const neighbors = geohash.neighbors(centerGeohash);
    neighbors.push(centerGeohash);
    return neighbors;
  },
  calcPrecisionByZoom: (zoom) => {
    return Math.floor((zoom + 1) / 3);
  },
  parseState: (key) => {
    return key.charAt(key.indexOf('-') + 1);
  },
  replaceState: (key, newState) => {
    return key.substring(0, key.indexOf('-') + 1) + newState +
      key.substring(key.indexOf('-') + 2, key.length);
  }
};
