/* eslint-disable max-len */

const initTime = new Date();
const dayInMs = 1000 * 60 * 60 * 24;

/*
  IMPORTANT
  The order of data should keep in same sequence
 */

export const mockItems = [
  {
    key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {
      title: 'Lion popup store',
      lat: 37.756787937,
      lng: -122.4233365122,
      address: '310 Dolores St, San Francisco, CA 94110, USA',
      createdDate: '2016-10-13T01:11:46.851Z',
      modifiedDate: '2016-10-13T01:11:46.851Z',
      category: 'event',
      startTime: '2016-10-13T01:11:46.851Z',
      endTime: new Date(initTime.getTime() + 60000).toISOString(),
      state: 'alive',
      key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
      userKey: 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid'
    }
  },
  {
    key: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
    value: {
      title: 'Generation Beauty by ipsy 2016',
      lat: 37.7579415,
      lng: -122.4204612,
      address: '600 Guerrero St, San Francisco, CA 94110, United States',
      createdDate: '2016-10-12T01:11:46.851Z',
      modifiedDate: '2016-10-12T01:11:46.851Z',
      category: 'event',
      startTime: '2016-10-12T01:11:46.851Z',
      endTime: new Date(initTime.getTime() + dayInMs * 2).toISOString(),
      state: 'alive',
      key: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
      userKey: 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid'
    }
  },
  {
    key: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
    value: {
      title: 'Union Square Public Toilet',
      lat: 37.7632684,
      lng: -122.4182374,
      address: '2295 Harrison St, San Francisco, CA 94110, United States',
      createdDate: '2016-10-08T01:11:46.851Z',
      modifiedDate: '2016-10-08T01:11:46.851Z',
      category: 'facility',
      state: 'alive',
      key: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
      userKey: 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid'
    }
  },
  {
    key: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
    value: {
      title: 'Cafe Free Wifi',
      lat: 37.7652022,
      lng: -122.4201257,
      address: '2500 17th St, San Francisco, CA 94110, United State',
      createdDate: '2016-10-09T01:11:46.851Z',
      modifiedDate: '2016-10-09T01:11:46.851Z',
      category: 'facility',
      state: 'alive',
      key: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
      userKey: 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid'
    }
  },
  {
    key: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
    value: {
      title: 'Fatal crash',
      lat: 37.7665825,
      lng: -122.420037,
      address: '1800 Mission St, San Francisco, CA 94103, United States',
      createdDate: '2016-10-11T01:11:46.851Z',
      modifiedDate: '2016-10-11T01:11:46.851Z',
      category: 'warning',
      startTime: '2016-10-11T01:11:46.851Z',
      endTime: new Date(initTime.getTime() + dayInMs * 5).toISOString(),
      state: 'alive',
      key: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
      userKey: 'user-8523574664000-dd3860f5-b82e-473b-1234-ead0f54gvr00'
    }
  },
  {
    key: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
    value: {
      title: 'Magnitude 2.5 earthquake',
      lat: 37.7602867,
      lng: -122.4271415,
      address: '19th St & Dolores Street, San Francisco, CA 94114, United States',
      createdDate: '2016-10-10T01:11:46.851Z',
      modifiedDate: '2016-10-10T01:11:46.851Z',
      category: 'warning',
      startTime: '2016-10-10T01:11:46.851Z',
      endTime: new Date(initTime.getTime() + dayInMs * 6).toISOString(),
      state: 'alive',
      key: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
      userKey: 'user-8523574664000-dd3860f5-b82e-473b-1234-ead0f54gvr00'
    }
  }
];
export const expiredItem = {
  key: 'item-8523910540006-dd3860f5-b82e-473b-1234-ead0f190b006',
  value: {
    title: 'Expired Item',
    lat: 37.764375,
    lng: -122.438096,
    address: 'Expired Item Address',
    createdDate: '2016-10-10T01:11:46.851Z',
    modifiedDate: '2016-10-10T01:11:46.851Z',
    category: 'warning',
    startTime: '2016-10-10T01:11:46.851Z',
    state: 'alive',
    endTime: '1999-01-01T10:10:10.851Z',
    userKey: 'user-8523574664000-dd3860f5-b82e-473b-1234-ead0f54gvr00'
  }
};
expiredItem.value.key = expiredItem.key;
mockItems.push(expiredItem);
export const mockItemIndexies = [
  {
    key: 'item-0-9q8yy1qj-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000'}
  },
  {
    key: 'item-0-9q8yy1q-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000'}
  },
  {
    key: 'item-0-9q8yy1-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000'}
  },
  {
    key: 'item-0-9q8yy-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000'}
  },
  {
    key: 'item-0-9q8y-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000'}
  },
  {
    key: 'item-0-9q8-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000'}
  },
  {
    key: 'item-0-9q-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000'}
  },
  {
    key: 'item-0-9-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000'}
  },
  {
    key: 'item-0-9q8yy385-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
    value: {key: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001'}
  },
  {
    key: 'item-0-9q8yy38-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
    value: {key: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001'}
  },
  {
    key: 'item-0-9q8yy3-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
    value: {key: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001'}
  },
  {
    key: 'item-0-9q8yy-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
    value: {key: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001'}
  },
  {
    key: 'item-0-9q8y-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
    value: {key: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001'}
  },
  {
    key: 'item-0-9q8-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
    value: {key: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001'}
  },
  {
    key: 'item-0-9q-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
    value: {key: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001'}
  },
  {
    key: 'item-0-9-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
    value: {key: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001'}
  },
  {
    key: 'item-0-9q8yy69f-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
    value: {key: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005'}
  },
  {
    key: 'item-0-9q8yy69-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
    value: {key: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005'}
  },
  {
    key: 'item-0-9q8yy6-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
    value: {key: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005'}
  },
  {
    key: 'item-0-9q8yy-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
    value: {key: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005'}
  },
  {
    key: 'item-0-9q8y-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
    value: {key: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005'}
  },
  {
    key: 'item-0-9q8-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
    value: {key: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005'}
  },
  {
    key: 'item-0-9q-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
    value: {key: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005'}
  },
  {
    key: 'item-0-9-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
    value: {key: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005'}
  },
  {
    key: 'item-0-9q8yy6bq-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
    value: {key: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004'}
  },
  {
    key: 'item-0-9q8yy6b-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
    value: {key: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004'}
  },
  {
    key: 'item-0-9q8yy6-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
    value: {key: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004'}
  },
  {
    key: 'item-0-9q8yy-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
    value: {key: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004'}
  },
  {
    key: 'item-0-9q8y-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
    value: {key: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004'}
  },
  {
    key: 'item-0-9q8-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
    value: {key: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004'}
  },
  {
    key: 'item-0-9q-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
    value: {key: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004'}
  },
  {
    key: 'item-0-9-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
    value: {key: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004'}
  },
  {
    key: 'item-0-9q8yy70q-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
    value: {key: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002'}
  },
  {
    key: 'item-0-9q8yy70-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
    value: {key: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002'}
  },
  {
    key: 'item-0-9q8yy7-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
    value: {key: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002'}
  },
  {
    key: 'item-0-9q8yy-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
    value: {key: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002'}
  },
  {
    key: 'item-0-9q8y-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
    value: {key: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002'}
  },
  {
    key: 'item-0-9q8-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
    value: {key: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002'}
  },
  {
    key: 'item-0-9q-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
    value: {key: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002'}
  },
  {
    key: 'item-0-9-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
    value: {key: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002'}
  },
  {
    key: 'item-0-9q8yy453-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
    value: {key: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003'}
  },
  {
    key: 'item-0-9q8yy45-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
    value: {key: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003'}
  },
  {
    key: 'item-0-9q8yy4-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
    value: {key: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003'}
  },
  {
    key: 'item-0-9q8yy-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
    value: {key: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003'}
  },
  {
    key: 'item-0-9q8y-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
    value: {key: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003'}
  },
  {
    key: 'item-0-9q8-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
    value: {key: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003'}
  },
  {
    key: 'item-0-9q-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
    value: {key: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003'}
  },
  {
    key: 'item-0-9-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
    value: {key: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003'}
  },
  {
    key: 'item-0-9-8523910540006-dd3860f5-b82e-473b-1234-ead0f190b006',
    value: {key: expiredItem.key}
  },
  {
    key: 'item-0-9q-8523910540006-dd3860f5-b82e-473b-1234-ead0f190b006',
    value: {key: expiredItem.key}
  },
  {
    key: 'item-0-9q8-8523910540006-dd3860f5-b82e-473b-1234-ead0f190b006',
    value: {key: expiredItem.key}
  },
  {
    key: 'item-0-9q8y-8523910540006-dd3860f5-b82e-473b-1234-ead0f190b006',
    value: {key: expiredItem.key}
  },
  {
    key: 'item-0-9q8yv-8523910540006-dd3860f5-b82e-473b-1234-ead0f190b006',
    value: {key: expiredItem.key}
  },
  {
    key: 'item-0-9q8yvf-8523910540006-dd3860f5-b82e-473b-1234-ead0f190b006',
    value: {key: expiredItem.key}
  },
  {
    key: 'item-0-9q8yvfg-8523910540006-dd3860f5-b82e-473b-1234-ead0f190b006',
    value: {key: expiredItem.key}
  },
  {
    key: 'item-0-9q8yvfg3-8523910540006-dd3860f5-b82e-473b-1234-ead0f190b006',
    value: {key: expiredItem.key}
  }
];
export const mockUsers = [
  {
    key: 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid',
    value: {
      key: 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid',
      userName: 'Moongchi Jeong',
      createdDate: '2007-11-22T07:30:38.064Z'
    }
  },
  {
    key: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
    value: {
      key: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      userName: 'Patrick Shim',
      createdDate: '2016-10-14T07:30:38.064Z'
    }
  }
];
export const CREATED_POSTS_LENGTH_OF_TEST_USER = 3;
export const mockCreatedPosts = [
  {
    key: 'createdPost-0-user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {
      entity: 'image',
      itemKey: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
      imageKey: 'image-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000'
    }
  },
  {
    key: 'createdPost-0-user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid-8523569763000-dd3860f5-b82e-473b-1234-ead0fzr0b000',
    value: {
      entity: 'image',
      itemKey: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
      imageKey: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0fzr0b000'
    }
  },
  {
    key: 'createdPost-0-user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0bze0',
    value: {
      entity: 'item',
      itemKey: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
      imageKey: 'image-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0bze0'
    }
  },
  {
    key: 'createdPost-0-user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {
      entity: 'image',
      itemKey: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
      imageKey: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190b000'
    }
  }
];
export const mockSavedPosts = [
  {
    key: 'savedPost-0-user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid-item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {
      key: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000'
    }
  },
  {
    key: 'savedPost-0-user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid-item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
    value: {
      key: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001'
    }
  }
];
export const mockImages = [
  {
    key: 'image-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {
      key: 'image-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
      itemKey: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
      userKey: 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid',
      caption: 'testImage1Caption1',
      createdDate: '2016-10-14T07:30:38.064Z'
    }
  },
  {
    key: 'image-8523569761934-dd3860f5-b82e-473b-1234-ead0fts0b000',
    value: {
      key: 'image-8523569761934-dd3860f5-b82e-473b-1234-ead0fts0b000',
      itemKey: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage1Caption2',
      createdDate: '2016-10-14T07:30:40.064Z'
    }
  },
  {
    key: 'image-8523569761934-dd3860f5-b82e-473b-1234-ead0fts43200',
    value: {
      key: 'image-8523569761934-dd3860f5-b82e-473b-1234-ead0fts43200',
      itemKey: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage1Caption3',
      createdDate: '2016-10-14T07:30:42.064Z'
    }
  },
  {
    key: 'image-8523569761934-dd3860f5-b82e-473b-1234-ead0f54gvr00',
    value: {
      key: 'image-8523569761934-dd3860f5-b82e-473b-1234-ead0f54gvr00',
      itemKey: 'item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage1Caption4',
      createdDate: '2016-10-14T07:30:46.064Z'
    }
  },
  {
    key: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190ae00',
    value: {
      key: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190ae00',
      itemKey: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage2Caption1',
      createdDate: '2016-10-14T07:30:42.064Z'
    }
  },
  {
    key: 'image-8523569764000-dd3860f5-b82e-4zeb-1234-ead0fts0b000',
    value: {
      key: 'image-8523569764000-dd3860f5-b82e-4zeb-1234-ead0fts0b000',
      itemKey: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage2Caption2',
      createdDate: '2016-10-14T07:31:40.064Z'
    }
  },
  {
    key: 'image-8523569765000-dd3860f5-b82e-473b-1234-ead0fts43ze0',
    value: {
      key: 'image-8523569765000-dd3860f5-b82e-473b-1234-ead0fts43ze0',
      itemKey: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage2Caption3',
      createdDate: '2016-10-14T07:31:47.064Z'
    }
  },
  {
    key: 'image-8523569766000-dd3860f5-bree-473b-1234-ead0f54gvr00',
    value: {
      key: 'image-8523569766000-dd3860f5-bree-473b-1234-ead0f54gvr00',
      itemKey: 'item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage2Caption4',
      createdDate: '2016-10-14T07:31:50.064Z'
    }
  },
  // this image is used as a created post of mock user.
  {
    key: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0fzr0b000',
    value: {
      key: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0fzr0b000',
      itemKey: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
      userKey: 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid',
      caption: 'testImage3Caption1',
      createdDate: '2016-10-14T07:31:42.064Z'
    }
  },
  {
    key: 'image-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0bze0',
    value: {
      key: 'image-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0bze0',
      itemKey: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage3Caption2',
      createdDate: '2016-10-14T07:31:46.064Z'
    }
  },
  {
    key: 'image-8523569765000-dd3860f5-b82e-473b-1234-eaaedts43200',
    value: {
      key: 'image-8523569765000-dd3860f5-b82e-473b-1234-eaaedts43200',
      itemKey: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage3Caption3',
      createdDate: '2016-10-14T07:31:59.064Z'
    }
  },
  {
    key: 'image-8523569766000-dd3860f5-b82e-473b-1234-ead0f54g2500',
    value: {
      key: 'image-8523569766000-dd3860f5-b82e-473b-1234-ead0f54g2500',
      itemKey: 'item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage3Caption4',
      createdDate: '2016-10-14T07:32:50.064Z'
    }
  },
  // this image is used as a created post of mock user.
  {
    key: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {
      key: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190b000',
      itemKey: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
      userKey: 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid',
      caption: 'testImage4Caption1',
      createdDate: '2016-10-14T07:32:42.064Z'
    }
  },
  {
    key: 'image-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0aed0',
    value: {
      key: 'image-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0aed0',
      itemKey: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
      userKey: 'user-8000000000000-uuiduuid-uuid-uuid-uuid-uuiduuiduuid',
      caption: 'testImage4Caption2',
      createdDate: '2016-10-14T07:32:46.064Z'
    }
  },
  {
    key: 'image-8523569765000-dd3860f5-b82e-473b-1234-ead0fts43200',
    value: {
      key: 'image-8523569765000-dd3860f5-b82e-473b-1234-ead0fts43200',
      itemKey: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage4Caption3',
      createdDate: '2016-10-14T07:32:59.064Z'
    }
  },
  {
    key: 'image-8523569766000-dd3860f5-b82e-473b-1234-ead0ar4gvr00',
    value: {
      key: 'image-8523569766000-dd3860f5-b82e-473b-1234-ead0ar4gvr00',
      itemKey: 'item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage4Caption4',
      createdDate: '2016-10-14T07:34:50.064Z'
    }
  },
  {
    key: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190baec',
    value: {
      key: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190baec',
      itemKey: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage5Caption1',
      createdDate: '2016-10-14T07:32:42.064Z'
    }
  },
  {
    key: 'image-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0b000',
    value: {
      key: 'image-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0b000',
      itemKey: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage5Caption2',
      createdDate: '2016-10-14T07:32:46.064Z'
    }
  },
  {
    key: 'image-8523569765000-dd3860f5-b82e-473b-1234-ead0ftae3200',
    value: {
      key: 'image-8523569765000-dd3860f5-b82e-473b-1234-ead0ftae3200',
      itemKey: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage5Caption3',
      createdDate: '2016-10-14T07:32:59.064Z'
    }
  },
  {
    key: 'image-8523569766000-dd3860f5-b82e-473b-1234-ead0f54gvrze',
    value: {
      key: 'image-8523569766000-dd3860f5-b82e-473b-1234-ead0f54gvrze',
      itemKey: 'item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage5Caption4',
      createdDate: '2016-10-14T07:34:50.064Z'
    }
  },
  {
    key: 'image-8523570564200-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {
      key: 'image-8523570564200-dd3860f5-b82e-473b-1234-ead0f190b000',
      itemKey: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage6Caption1',
      createdDate: '2016-10-14T07:32:42.064Z'
    }
  },
  {
    key: 'image-8523570664000-dd3860f5-b82e-473b-1234-ead0fts0b000',
    value: {
      key: 'image-8523570664000-dd3860f5-b82e-473b-1234-ead0fts0b000',
      itemKey: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage6Caption2',
      createdDate: '2016-10-14T07:32:46.064Z'
    }
  },
  {
    key: 'image-8523571664000-dd3860f5-b82e-473b-1234-ead0fts43200',
    value: {
      key: 'image-8523571664000-dd3860f5-b82e-473b-1234-ead0fts43200',
      itemKey: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage6Caption3',
      createdDate: '2016-10-14T07:32:59.064Z'
    }
  },
  {
    key: 'image-8523574664000-dd3860f5-b82e-473b-1234-ead0f54gvr00',
    value: {
      key: 'image-8523574664000-dd3860f5-b82e-473b-1234-ead0f54gvr00',
      itemKey: 'item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003',
      userKey: 'user-8523569762000-dd3860f5-b82e-473b-4314-ead23640b000',
      caption: 'testImage6Caption4',
      createdDate: '2016-10-14T07:34:50.064Z'
    }
  }
];
export const mockImageIndexies = [
  {
    key: 'image-0-item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {key: 'image-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000'}
  },
  {
    key: 'image-0-item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000-8523569761934-dd3860f5-b82e-473b-1234-ead0fts0b000',
    value: {key: 'image-8523569761934-dd3860f5-b82e-473b-1234-ead0fts0b000'}
  },
  {
    key: 'image-0-item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000-8523569761934-dd3860f5-b82e-473b-1234-ead0fts43200',
    value: {key: 'image-8523569761934-dd3860f5-b82e-473b-1234-ead0fts43200'}
  },
  {
    key: 'image-0-item-8523910540005-dd3860f5-b82e-473b-1234-ead0f190b000-8523569761934-dd3860f5-b82e-473b-1234-ead0f54gvr00',
    value: {key: 'image-8523569761934-dd3860f5-b82e-473b-1234-ead0f54gvr00'}
  },
  {
    key: 'image-0-item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001-8523569763000-dd3860f5-b82e-473b-1234-ead0f190ae00',
    value: {key: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190ae00'}
  },
  {
    key: 'image-0-item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001-8523569764000-dd3860f5-b82e-4zeb-1234-ead0fts0b000',
    value: {key: 'image-8523569764000-dd3860f5-b82e-4zeb-1234-ead0fts0b000'}
  },
  {
    key: 'image-0-item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001-8523569765000-dd3860f5-b82e-473b-1234-ead0fts43ze0',
    value: {key: 'image-8523569765000-dd3860f5-b82e-473b-1234-ead0fts43ze0'}
  },
  {
    key: 'image-0-item-8523910540004-dd3860f5-b82e-473b-1234-ead0f190b001-8523569766000-bree-473b-1234-ead0f54gvr00',
    value: {key: 'image-8523569766000-dd3860f5-bree-473b-1234-ead0f54gvr00'}
  },
  {
    key: 'image-0-item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005-8523569763000-dd3860f5-b82e-473b-1234-ead0fzr0b000',
    value: {key: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0fzr0b000'}
  },
  {
    key: 'image-0-item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0bze0',
    value: {key: 'image-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0bze0'}
  },
  {
    key: 'image-0-item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005-8523569765000-dd3860f5-b82e-473b-1234-eaaedts43200',
    value: {key: 'image-8523569765000-dd3860f5-b82e-473b-1234-eaaedts43200'}
  },
  {
    key: 'image-0-item-8523910540000-dd3860f5-b82e-473b-1234-ead0f190b005-8523569766000-dd3860f5-b82e-473b-1234-ead0f54g2500',
    value: {key: 'image-8523569766000-dd3860f5-b82e-473b-1234-ead0f54g2500'}
  },
  {
    key: 'image-0-item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004-8523569763000-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {key: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190b000'}
  },
  {
    key: 'image-0-item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0aed0',
    value: {key: 'image-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0aed0'}
  },
  {
    key: 'image-0-item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004-8523569765000-dd3860f5-b82e-473b-1234-ead0fts43200',
    value: {key: 'image-8523569765000-dd3860f5-b82e-473b-1234-ead0fts43200'}
  },
  {
    key: 'image-0-item-8523910540001-dd3860f5-b82e-473b-1234-ead0f190b004-8523569766000-dd3860f5-b82e-473b-1234-ead0ar4gvr00',
    value: {key: 'image-8523569766000-dd3860f5-b82e-473b-1234-ead0ar4gvr00'}
  },
  {
    key: 'image-0-item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002-8523569763000-dd3860f5-b82e-473b-1234-ead0f190baec',
    value: {key: 'image-8523569763000-dd3860f5-b82e-473b-1234-ead0f190baec'}
  },
  {
    key: 'image-0-item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0b000',
    value: {key: 'image-8523569764000-dd3860f5-b82e-473b-1234-ead0fts0b000'}
  },
  {
    key: 'image-0-item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002-8523569765000-dd3860f5-b82e-473b-1234-ead0ftae3200',
    value: {key: 'image-8523569765000-dd3860f5-b82e-473b-1234-ead0ftae3200'}
  },
  {
    key: 'image-0-item-8523910540003-dd3860f5-b82e-473b-1234-ead0f190b002-8523569766000-dd3860f5-b82e-473b-1234-ead0f54gvrze',
    value: {key: 'image-8523569766000-dd3860f5-b82e-473b-1234-ead0f54gvrze'}
  },
  {
    key: 'image-0-item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003-8523570564200-dd3860f5-b82e-473b-1234-ead0f190b000',
    value: {key: 'image-8523570564200-dd3860f5-b82e-473b-1234-ead0f190b000'}
  },
  {
    key: 'image-0-item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003-8523570664000-dd3860f5-b82e-473b-1234-ead0fts0b000',
    value: {key: 'image-8523570664000-dd3860f5-b82e-473b-1234-ead0fts0b000'}
  },
  {
    key: 'image-0-item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003-8523571664000-dd3860f5-b82e-473b-1234-ead0fts43200',
    value: {key: 'image-8523571664000-dd3860f5-b82e-473b-1234-ead0fts43200'}
  },
  {
    key: 'image-0-item-8523910540002-dd3860f5-b82e-473b-1234-ead0f190b003-8523574664000-dd3860f5-b82e-473b-1234-ead0f54gvr00',
    value: {key: 'image-8523574664000-dd3860f5-b82e-473b-1234-ead0f54gvr00'}
  }
];
/* eslint-enable */
