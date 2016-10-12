import AWS from 'aws-sdk';
import config from 'config';

AWS.config.loadFromPath(config.awsConfig);

export class S3Connector {
  constructor() {
    this.s3instance = new AWS.S3();
  }

  getImage(opt = {}, cb = () => {}) {
    // opt {
    //   itemid: 'id',
    //   imageid: 'id'
    // }
    console.log(opt); // will be removed
    this.s3instance.listObjects({Bucket: config.awsImageBucket}, (err, data) => {
      if (err) {
        return cb(err);
      }
      return cb(null, data);
    });
  }

  putImage(opt = {}) {
    console.log(opt); // will be removed
  }

  delImage(opt = {}) {
    console.log(opt); // will be removed
  }

}
/*
class MockS3 {
  constructor() {}

  listObjects(opt={}, cb=this.next) {
    if (!opt.Bucket) {
      const err = new Error('No Bucket');
      return cb(err);
    }
    return {
      IsTruncated: false,
      Marker: opt.Marker ? opt.Marker : '',
      Contents: [],
      Name: opt.Bucket,
      Prefix: '',
      MaxKeys: 1000,
      CommonPrefixes: []
    };
  }

  next(err=null, data={}) {}
}
*/
