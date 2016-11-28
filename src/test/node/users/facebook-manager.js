import test from 'tape';
import FacebookManager, {FacebookModel, APP_ID, FACEBOOK_TEST_ID}
  from '../../../server/users/facebook-manager';
import {ENTITY, STATE} from '../../../server/key-utils';
import {clearDB, putPromise} from '../../../server/database';

test('should get user profile', t => {
  const expected = {
    name: 'Open Graph Test User',
    id: 'SECRET_FACEBOOK_ID'
  };

  FacebookManager.getTestAccessToken()
    .then(FacebookManager.getProfile)
    .then((profile) => {
      t.equal(profile.name, expected.name, 'should be same name');
      t.ok(profile.id, 'should be get facebook id');
      t.end();
    })
    .catch(err => {
      t.fail();
      t.end(err);
    });
});

test('should get user profile image url from facebook.', t => {
  const mockId = APP_ID;

  FacebookManager.getProfileImage(mockId)
    .then((imageUrl) => {
      t.ok(imageUrl, 'facebook profile image url is arrived');
      t.end();
    })
    .catch(err => {
      t.fail();
      t.end(err);
    });
});

test('should get user id from facebook.', t => {
  const expected = {
    facebookId: FACEBOOK_TEST_ID
  };
  FacebookManager.getTestAccessToken()
    .then(FacebookManager.getId)
    .then(facebookId => {
      t.equal(facebookId, expected.facebookId, 'facebook id is same.');
      t.end();
    })
    .catch(err => {
      t.fail();
      t.end(err);
    });
});

test('should get facebook test user token from facebook', t => {
  FacebookManager.getTestAccessToken()
    .then(FacebookManager.getProfile)
    .then(profile => {
      t.ok(profile, 'get valid facebook test user token from facebook.');
      t.end();
    })
    .catch(err => {
      t.fail();
      t.end(err);
    });
});
test('should get facebook user index key', t => {
  const MOCK_FACEBOOK_ID = 'mockFacebookId';
  const expected = {
    idxKey: `${ENTITY.USER}-${STATE.ALIVE}-${ENTITY.FACEBOOK}-${MOCK_FACEBOOK_ID}`
  };
  const idxKey = FacebookModel.getIdxKey(MOCK_FACEBOOK_ID);
  t.equal(idxKey, expected.idxKey, 'should be same facebook index key.');
  t.end();
});
test('should be check duplicated facebook user', t => {
  const mockUser = {
    key: 'mockUserKey',
    facebookId: 'mockFacebookId'
  };
  const mockIdxKey = `${ENTITY.USER}-${STATE.ALIVE}-${ENTITY.FACEBOOK}-${mockUser.facebookId}`;
  const expected = {
    facebookId: mockUser.facebookId,
    message: 'Already exist.'
  };
  clearDB()
    .then(() => {
      return FacebookModel.isDuplicated(mockUser.facebookId);
    })
    .then(facebookId => {
      t.equal(facebookId, expected.facebookId, 'should be same facebook id.');
    })
    .catch(err => {
      t.fail(err.message);
      t.end();
    })
    .then(() => {
      return putPromise(mockIdxKey, {key: mockUser.key});
    })
    .then(() => {
      return FacebookModel.isDuplicated(mockUser.facebookId);
    })
    .then(() => {
      t.fail('facebook user duplicate check failed.');
      t.end();
    })
    .catch(err => {
      t.equal(err.message, expected.message, 'shoulde be same error message.');
      t.end();
    });
});
