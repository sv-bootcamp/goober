import express from 'express';
import controller from './controllers';

const router = express.Router();

router.get('/', controller.get);
