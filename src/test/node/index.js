require('source-map-support').install();

// Entry point for tests that will be run in Node.
// Add more tests by importing them here.

import './server';
import './items/models';
import './items/validator';
import './items/controllers';
import './database';
