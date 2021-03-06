import AWS from 'aws-sdk';
import config from 'config';
import fs from 'fs';

export const IMAGE_SIZE_PREFIX = {
  THUMBNAIL: 'thumbnail'
};

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
  getSignedUrl(method, params) {
    // method is not used
    params.method = method;
    return `url-of-${params.Key}`;
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

export const S3Utils = {
  imgToBase64: (imgPath, cb) => {
    fs.readFile(imgPath, (err, image) => {
      return cb(err, new Buffer(image, 'binary').toString('base64'));
    });
  }
};

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
      if (!process.env.AWS_ACCESS_KEY_ID) {
        AWS.config.loadFromPath(config.awsConfig);
      }
      if (process.env.AWS_REGION) {
        AWS.config.region = process.env.AWS_REGION;
      }
      this.s3instance = new AWS.S3();
    }
  }
  getImageUrl(key) {
    const params = {
      Bucket: config.awsImageBucket,
      Key: key,
      Expires: 120
    };
    const url = this.s3instance.getSignedUrl('getObject', params);
    return url.split('?')[0];
  }
  getImageUrls(keys = []) {
    const urlList = [];
    for (const key of keys) {
      urlList.push(this.getImageUrl(key));
    }
    return urlList;
  }
  fetchImageUrls(images = []) {
    return images.map(image => {
      image.imageUrl = this.getImageUrl(image.key);
      return image;
    });
  }
  getPrefixedImageUrl(key, prefix) {
    return this.getImageUrl(`${prefix}-${key}`);
  }
  getPrefixedImageUrls(keys, prefix) {
    return this.getImageUrls(keys.map((key) => {
      return `${prefix}-${key}`;
    }));
  }
  putImage(opt = {}, cb = () => {}) {
    // input parameters
    // opt = {
    //   key; 'data-key',
    //   body: 'some string (image-encoded-base64)'
    // }
    //
    // callback parameter
    // err  : error when fail put image
    // data : { ETag : 'etag string'}
    if (!opt.key || !opt.body) {
      cb(new Error('Wrong parameter'));
      return;
    }
    const params = {
      Bucket: config.awsImageBucket,
      Key: opt.key,
      Body: new Buffer(opt.body, 'base64'),
      ACL: 'public-read',
      ContentType: 'image/png',
      ContentEncoding: 'base64'
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
