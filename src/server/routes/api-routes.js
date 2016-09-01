import express from 'express';
import items from '../items/items-routes';
const router = express.Router();

router.use('/items', items);

export default router;
