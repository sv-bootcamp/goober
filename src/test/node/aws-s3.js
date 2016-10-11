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
