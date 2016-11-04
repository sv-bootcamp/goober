export const MAX_TIME = 10000000000000;
export const DEFAULT_PRECISON = 8;
export const STATE = {ALIVE: '0', EXPIRED: '1', REMOVED: '2'};
export const STATE_STRING = {
  [STATE.ALIVE]: 'alive',
  [STATE.EXPIRED]: 'expired',
  [STATE.REMOVED]: 'removed'
};
export const ENTITY = {
  ITEM: 'item',
  REPORT: 'report',
  IMAGE: 'image',
  COMMENT: 'comment',
  USER: 'user',
  CREATED_POST: 'createdPost',
  SAVED_POST: 'savedPost',
  REACT_POST: 'reactPost'
};
export const CATEGORY = {
  EVENT: 'event',
  WARNING: 'warning',
  FACILITY: 'facility'
};
export const DELIMITER_NUM_IN_KEY = 6;
export const TIMEHASH_LENGTH = 50;

export const IMAGE_SIZE_PREFIX = {
  THUMBNAIL: 'thumbnail'
};
