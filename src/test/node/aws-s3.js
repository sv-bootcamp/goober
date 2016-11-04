import test from 'tape';
import {S3Connector} from '../../server/aws-s3';
import fs from 'fs';
import config from 'config';
import {IMAGE_SIZE_PREFIX} from '../../server/constants';
test('test aws instance', t => {
  fs.readFile(`${config.awsConfig}`, 'utf8', (err, json) => {
    if (err) {
      t.fail('Error occur while reading config json');
      return t.end();
    }
    const awsConfig = JSON.parse(json);
    const expected = {
      protocol: 'https:',
      host: `s3.${awsConfig.region}.amazonaws.com`
    };
    const conn = new S3Connector();
    t.equal(conn.s3instance.endpoint.protocol, expected.protocol,
      'protocol should be same');
    t.equal(conn.s3instance.endpoint.host, expected.host,
      'host should be same');
    return t.end();
  });
});
test('test s3 put image', t => {
  fs.readFile('src/test/node/test.png', (errRead, image) => {
    if (errRead) {
      /* eslint-disable no-console */
      console.log(errRead);
      /* eslint-enable */
      t.fail('Error occur while reading image file');
      t.end();
      return;
    }
    const base64Image = new Buffer(image, 'binary').toString('base64');
    const conn = new S3Connector();
    const opt = {
      key: 'test-image',
      body: base64Image
    };

    conn.putImage(opt, (err, data) => {
      if (err) {
        /* eslint-disable no-console */
        console.log(err);
        /* eslint-enable */
        t.fail('Error, putImage fail');
        t.end();
        return;
      }
      t.ok(data.ETag, 'should have ETag in response');
      t.end();
      return;
    });
  });
});
test('test s3 get image', t => {
  const conn = new S3Connector();
  const opt = ['test-image', '11'];
  const expected = {
    length: opt.length
  };
  const data = conn.getImageUrls(opt);
  t.equal(data.length, expected.length, 'should be same length');
  t.end();
});
test('test s3 delete image', t => {
  const conn = new S3Connector();
  const opt = {
    key: 'test-image'
  };
  conn.delImage(opt, (err) => {
    if (err) {
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable */
      t.fail('Error, delImage');
      t.end();
      return;
    }
    t.ok(true, 'image removed');
    t.end();
  });
});
test('test get image url', t => {
  const conn = new S3Connector();
  const imageKey = 'test-image-key';
  const expected = {
    imageUrl: 'url-of-test-image-key'
  };
  const result = conn.getImageUrl(imageKey);
  t.equal(result, expected.imageUrl, 'should be same image url');
  t.end();
});
test('test get image urls', t => {
  const conn = new S3Connector();
  const imageKeys = [
    'test-image-key1',
    'test-image-key2',
    'test-image-key3',
    'test-image-key4',
    'test-image-key5'
  ];
  const expected = {
    imageUrls: [
      'url-of-test-image-key1',
      'url-of-test-image-key2',
      'url-of-test-image-key3',
      'url-of-test-image-key4',
      'url-of-test-image-key5'
    ]
  };
  const result = conn.getImageUrls(imageKeys);
  for (let i = 0; i < result.length; i = i + 1) {
    t.equal(result[i], expected.imageUrls[i], 'should be same image urls');
  }
  t.end();
});
test('test get thumbnail image url', t => {
  const conn = new S3Connector();
  const imageKey = 'test-image-key';
  const expected = {
    imageUrl: `url-of-${IMAGE_SIZE_PREFIX.THUMBNAIL}-test-image-key`
  };
  const result = conn.getPrefixedImageUrl(imageKey, IMAGE_SIZE_PREFIX.THUMBNAIL);
  t.equal(result, expected.imageUrl, 'should be same image url');
  t.end();
});
test('test get image urls', t => {
  const conn = new S3Connector();
  const imageKeys = [
    'test-image-key1',
    'test-image-key2',
    'test-image-key3',
    'test-image-key4',
    'test-image-key5'
  ];
  const expected = {
    imageUrls: [
      `url-of-${IMAGE_SIZE_PREFIX.THUMBNAIL}-test-image-key1`,
      `url-of-${IMAGE_SIZE_PREFIX.THUMBNAIL}-test-image-key2`,
      `url-of-${IMAGE_SIZE_PREFIX.THUMBNAIL}-test-image-key3`,
      `url-of-${IMAGE_SIZE_PREFIX.THUMBNAIL}-test-image-key4`,
      `url-of-${IMAGE_SIZE_PREFIX.THUMBNAIL}-test-image-key5`
    ]
  };
  const result = conn.getPrefixedImageUrls(imageKeys, IMAGE_SIZE_PREFIX.THUMBNAIL);
  for (let i = 0; i < result.length; i = i + 1) {
    t.equal(result[i], expected.imageUrls[i], 'should be same image urls');
  }
  t.end();
});
