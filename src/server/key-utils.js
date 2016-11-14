import geohash from 'ngeohash';
import uuid from 'uuid4';

export const MAX_TIME = 10000000000000;
export const DEFAULT_PRECISON = 8;
export const STATE = {ALIVE: '0', EXPIRED: '1', REMOVED: '2'};

export const ENTITY = {
  ITEM: 'item',
  REPORT: 'report',
  IMAGE: 'image',
  COMMENT: 'comment',
  USER: 'user',
  CREATED_POST: 'createdPost',
  SAVED_POST: 'savedPost',
  REACT_POST: 'reactPost',
  ANONYMOUS: 'anonymous',
  FACEBOOK: 'facebook'
};
export const CATEGORY = {
  EVENT: 'event',
  WARNING: 'warning',
  FACILITY: 'facility'
};
export const STATE_CODE_POS = 5;
export const GEOHASH_START_POS = 5;
export const GEOHASH_END_POS = GEOHASH_START_POS + DEFAULT_PRECISON - 1;
export const UUID_START_POS = 14;
export const REF_GEOHASH_START_POS = 7;
const DELIMITER_NUM_IN_KEY = 6;
const TIMEHASH_LENGTH = 50;
export class Timestamp {
  constructor(date) {
    this.timeStamp = MAX_TIME - Number(new Date(date));
  }
  getTimestamp() {
    return this.timeStamp;
  }
}
export class KeyMaker {
  constructor(lat, lng, date, type = STATE.ALIVE, precision = 8) {
    this.uuid = uuid();
    this.time = new Timestamp(date).getTimestamp();
    this.keys = [];
    this.keys.push(`item-${geohash.encode(lat, lng, precision)}-${this.uuid}`);

    for (let i = 1; i <= precision; i = i + 1) {
      this.keys.push(`item-${type}-${geohash.encode(lat, lng, i)}-${this.time}-${this.uuid}`);
    }
  }
  getKeyStream() {
    return this.keys;
  }
  getUuid() {
    return this.uuid;
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

// POST items/:itemId/reports

/*
  1. validation
  2. make key
    1. make original key
    2. make index key
      1. rule of index key is all same right?
        so we may be able to make function for that
    th = genTimehash()
    key = report-{th}
    idxKey = report-{STATE}-param.id-{th}
  3. save origin data
    db.put(key, data);
     db.put(idxKey, ~~~);
  4. return result;
*/
