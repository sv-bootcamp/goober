import test from 'tape';
import {initMock, clearDB} from '../../server/database';
import {mockUserKey} from '../../server/database-mock-data';
import {KeyUtils, ENTITY} from '../../server/key-utils';
import PostManager from '../../server/PostManager';

test('isPostType : check post type string', t => {
  const failCase = 'createpost';
  const successCase = 'createdPosts';
  const expected = {
    failCaseResult: false,
    successCaseResult: true
  };
  t.equal(PostManager.isPostType(failCase), expected.failCaseResult,
    'should be same result (false)');
  t.equal(PostManager.isPostType(successCase), expected.successCaseResult,
    'should be same result (true)');
  t.end();
});

test('get created posts with user key', t => {
  const expected = {
    timeHash: KeyUtils.getTimeHash(mockUserKey)
  };
  clearDB().then(initMock).then(()=>{
    PostManager.getPost(ENTITY.CREATED_POST, mockUserKey, (err, data) => {
      t.equal(KeyUtils.getTimeHash(data.key), expected.timeHash,
    'should be same timeHash');
      t.end();
    });
  }).catch((err)=>{
    t.fail('Error while reading from DB');
    t.end(err);
  });
});
