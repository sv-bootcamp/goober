import express from 'express';
import map from './map';

const router = express.Router();
router.use('/map', map);

export default router;
