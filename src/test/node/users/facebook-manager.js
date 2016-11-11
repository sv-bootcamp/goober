import test from 'tape';
import config from 'config';
import FacebookManager from '../../../server/users/facebook-manager';

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

  const mockId = config.FACEBOOK_TEST_ID;

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
    facebookId: config.FACEBOOK_TEST_ID
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
