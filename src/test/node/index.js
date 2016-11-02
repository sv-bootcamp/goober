require('source-map-support').install();

// Entry point for tests that will be run in Node.
// Add more tests by importing them here.

import './server';
import './key-utils';
import './items/validator';
import './items/controllers';
import './items/models';
import './images/models';
import './images/controllers';
import './users/controllers';
import './users/models';
import './auth/models';
import './auth/controllers';
import './database';
import './aws-s3';
import './auth-token';
import './items/models';
