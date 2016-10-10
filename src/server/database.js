import levelup from 'levelup';
import leveldown from 'leveldown';
import config from 'config';

const db = levelup(config.database, {valueEncoding: 'json'});
export default db;

export const clearDB = (cb) => {
  db.close(() => {
    leveldown.destroy(config.database, (err) => {
      if (err) {
        // error
      }
      db.open(cb);
    });
  });
};

export const initMock = () => {
  const curTime = new Date();
  const DEFAULT_STARTTIME = curTime.toISOString();
  const DEFAULT_ENDTIME = new Date(curTime.setDate(curTime.getDate() + 2)).toISOString();
  const ITEM_KEY_LIONPOPUPSTORE =
  'item-0-9q8yy1qj-8523910540578-9130b273-b82e-473b-8b22-ead0f190b232';
  const ITEM_KEY_CAFEFREEWIFI =
  'item-0-9q8yy385-8523910540579-532a520f-386b-48b2-a59a-0f6b8a1a3e49';
  const FISRT_IMAGE_KEY_LIONPOPUPSTORE =
  `images-${ITEM_KEY_LIONPOPUPSTORE}-8523904176025-532a520f-386b-48b2-a59a-0f6b8a1a3e49`;
  const SECOND_IMAGE_KEY_LIONPOPUPSTORE =
  `images-${ITEM_KEY_LIONPOPUPSTORE}-8523904176026-532a520f-386b-48b2-a59a-0f6b8a1a3e49`;
  const IMAGE_KEY_CAFEFREEWIFI =
  `images-${ITEM_KEY_CAFEFREEWIFI}-8523904176025-0c3f1d08-bd02-43e2-b9ef-5e5c0e1f18ce`;
  const itemLionPopupStore = {
    title: 'Lion popup store',
    lat: 37.756787937,
    lng: -122.4233365122,
    address: '310 Dolores St, San Francisco, CA 94110, USA',
    createdDate: '2016-10-10T02:18:22.893Z',
    modifiedDate: '2016-10-11T02:18:22.893Z',
    category: 'event',
    startTime: DEFAULT_STARTTIME,
    endTime: DEFAULT_ENDTIME
  };
  const itemCafeFreeWifi = {
    title: 'Tartine Cafe Free Wifi',
    lat: 37.7579415,
    lng: -122.4204612,
    address: '600 Guerrero St, San Francisco, CA 94110, United States',
    createdDate: '2016-10-10T08:34:04.665Z',
    modifiedDate: '2016-10-15T08:34:04.665Z',
    category: 'facility'
  };
  const firstImageLionPopupStore = {
    path: 'http://i67.tinypic.com/9lbk89.jpg',
    name: 'Arume Jeong',
    id: 'user-923a13f2-16d8-4389-9614-0e72e852073e',
    imagePath:
    'http://i66.tinypic.com/v7vz40.jpg',
    createdDate: '2016-10-10T02:18:22.893Z',
    caption: 'New York Herald Tribune!'
  };
  const secondImageLionPopupStore = {
    path: 'http://i68.tinypic.com/ivbl2g.jpg',
    name: 'Dahye Seol',
    id: 'user-923a13f3-16d8-4389-9614-0e72e852aaaa',
    imagePath: 'http://i67.tinypic.com/34fb9zn.jpg',
    createdDate: '2016-10-12T02:18:22.893Z',
    caption: 'I wanna eat salmon today.'
  };
  const ImageCafeFreeWifi = {
    path: 'http://i66.tinypic.com/v47774.jpg',
    name: 'Dahye Seol',
    id: 'user-923a13f3-16d8-4389-9614-0e72e852aaaa',
    imagePath: 'http://i67.tinypic.com/34fb9zn.jpg',
    createdDate: '2016-10-11T02:12:22.893Z',
    caption: 'I am not a fool😺'
  };
  const ops = [
      {type: 'put', key: ITEM_KEY_LIONPOPUPSTORE, value: itemLionPopupStore},
      {type: 'put', key: ITEM_KEY_CAFEFREEWIFI, value: itemCafeFreeWifi},
      {type: 'put', key: FISRT_IMAGE_KEY_LIONPOPUPSTORE, value: firstImageLionPopupStore},
      {type: 'put', key: SECOND_IMAGE_KEY_LIONPOPUPSTORE, value: secondImageLionPopupStore},
      {type: 'put', key: IMAGE_KEY_CAFEFREEWIFI, value: ImageCafeFreeWifi}
  ];
  db.batch(ops, (err) => {
    if (err) {
      return new Error(err);
    }
    return null;
  });
};
