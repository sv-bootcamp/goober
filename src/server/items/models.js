import geohash from 'ngeohash';
import uuid from 'uuid4';

export const MAX_TIME = 10000000000000;

export const DEFAULT_PRECISON = 8;
export const ALIVE = 0;
export const EXPIRED = 1;
export const REMOVED = 2;

export class KeyMaker {
  constructor(lat, lng, date, type = ALIVE, precision = 8) {
    this.uuid = uuid();
    this.time = MAX_TIME - Number(new Date(date));
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