import geohash from 'ngeohash';
import uuid from 'uuid4';

export const MAX_TIME = 10000000000000;

export const DEFAULT_PRECISON = 8;
export const ALIVE = '0';
export const EXPIRED = '1';
export const REMOVED = '2';
export const STATUS_CODE_POS = 5;
export const GEOHASH_START_POS = 5;
export const GEOHASH_END_POS = GEOHASH_START_POS + DEFAULT_PRECISON - 1;
export const UUID_START_POS = 14;


export class Timestamp {
  constructor(date) {
    this.timeStamp = MAX_TIME - Number(new Date(date));
  }
  getTimestamp() {
    return this.timeStamp;
  }
}
export class KeyMaker {
  constructor(lat, lng, date, type = ALIVE, precision = 8) {
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
