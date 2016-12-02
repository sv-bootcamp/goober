import express from 'express';
import controller from './controllers';

const router = express.Router();

router.get('/db', controller.db_get);
router.post('/db', controller.db_post);
router.delete('/db/:id', controller.db_delete);

export default router;
