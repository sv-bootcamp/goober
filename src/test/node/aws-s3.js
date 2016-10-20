import test from 'tape';
import {S3Connector} from '../../server/aws-s3';
import fs from 'fs';
import config from 'config';

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
