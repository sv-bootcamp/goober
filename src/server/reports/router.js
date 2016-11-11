import express from 'express';
import Controllers from './controllers';

const router = express.Router();
router.post('/:id', Controllers.post);
export default router;
