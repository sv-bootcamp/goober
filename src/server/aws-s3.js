import AWS from 'aws-sdk';
import config from 'config';
import fs from 'fs';

AWS.config.loadFromPath(config.awsConfig);

class MockS3 {
  // We can trust AWS-sdk
  // This class is just for test
  constructor(configuration) {
    const json = fs.readFileSync(configuration, 'utf8');
    const awsConfig = JSON.parse(json);
    this.endpoint = {};
    this.endpoint.protocol = 'https:';
    this.endpoint.host = `s3.${awsConfig.region}.amazonaws.com`;
  }

  getSignedUrl() {
    return 'some-url';
  }

  putObject(param = {}, cb = () => {}) {
    if (!param.Bucket || !param.Key || !param.Body) {
      cb(new Error('Error, Invalid parameter'));
      return;
    }
    cb(null, {ETag: 'some-tag-code'});
  }

  deleteObject(params = {}, cb = () => {}) {
    cb(null, params);
  }
}

export class S3Connector {
  constructor() {
    if (process.env.NODE_ENV === 'test') {
      // TODO: Real S3 instance test
      // Make sure that
      // You SHOULD test with real s3 instance when edit S3Connector
      // You have to change value of awsConfig of 'config/test.json'
      //   as 'aws.json' and fill 'aws.json' with proper values for real s3 instance test
      // this code is just for No more request at CI time (aws pretty expensive)
      this.s3instance = new MockS3(config.awsConfig);
    } else {
      this.s3instance = new AWS.S3();
    }
  }

  getImageUrls(keys = [], cb = () => {}) {
    // input parameters
    // keys = ['key1', 'key2'];
    //
    // callback parameters
    // err : err
    // data : array of url
    if (keys.length === 0) {
      cb(null, []);
      return;
    }
    const promises = [];
    const urlList = [];
    for (const key of keys) {
      promises.push(new Promise((resolve, reject) => {
        const params = {
          Bucket: config.awsImageBucket,
          Key: key,
          Expires: 120
        };
        const url = this.s3instance.getSignedUrl('getObject', params);
        if (!url) {
          reject('No url');
        }
        // remove query string
        urlList.push(url.split('?')[0]);
        resolve();
      }));
    }
    Promise.all(promises).then(() => {
      cb(null, urlList);
    }).catch((err) => {
      cb(err);
    });
  }

  putImage(opt = {}, cb = () => {}) {
    // input parameters
    // opt = {
    //   key; 'data-key',
    //   body: 'some string (image-encoded-base64)'
    // }
    if (!opt.key || !opt.body) {
      cb(new Error('Wrong parameter'));
      return;
    }
    const params = {
      Bucket: config.awsImageBucket,
      Key: opt.key,
      Body: opt.body,
      ACL: 'public-read'
    };
    this.s3instance.putObject(params, cb);
  }

  delImage(opt = {}, cb = () => {}) {
    // input parameters
    // opt = {
    //   key; 'data-key'
    // }
    if (!opt.key) {
      cb(new Error('Wrong parameter'));
      return;
    }
    const params = {
      Bucket: config.awsImageBucket,
      Key: opt.key
    };
    this.s3instance.deleteObject(params, cb);
  }

}
