import express from 'express';
import controller from './controllers';

const router = express.Router();


router.post('/auth/refresh', controller.refreshToken);
