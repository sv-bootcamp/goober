import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  next();
});

router.post('/', (req, res, next) => {
  next();
});

router.put('/', (req, res, next) => {
  next();
});

router.delete('/', (req, res, next) => {
  next();
});

router.get('/:id', (req, res, next) => {
  next();
});

router.put('/:id', (req, res, next) => {
  next();
});

router.delete('/:id', (req, res, next) => {
  next();
});

export default router;
