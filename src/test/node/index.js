require('source-map-support').install();

// Entry point for tests that will be run in Node.
// Add more tests by importing them here.

import './server';
import './key-utils';
import './items/validator';
import './items/controllers';
import './images/models';
import './images/controllers';
import './database';
import './aws-s3';
