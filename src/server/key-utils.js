import geohash from 'ngeohash';
import uuid from 'uuid4';

export const MAX_TIME = 10000000000000;

export const DEFAULT_PRECISON = 8;
export const STATE = { ALIVE: '0', EXPIRED: '1', REMOVED: '2'};
export const STATE_CODE_POS = 5;
export const GEOHASH_START_POS = 5;
export const GEOHASH_END_POS = GEOHASH_START_POS + DEFAULT_PRECISON - 1;
export const UUID_START_POS = 14;
export const REF_GEOHASH_START_POS = 7;

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
  getKeysByArea: (lat, lng, precision) => {
    const centerGeohash = geohash.encode(lat, lng, precision);
    const neighbors = geohash.neighbors(centerGeohash);
    neighbors.push(centerGeohash);
    return neighbors;
  },
  calcPrecisionByZoom: (zoom) => {
    return Math.floor((zoom + 1) / 3);
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




