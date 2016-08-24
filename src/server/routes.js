import express from 'express';
import UserController from './controllers/user';

const router = express.Router();

router.get('/user', (req, res) => {
  const {accessToken} = req.query;
  if (!accessToken) {
    res.status(400).send('AccessToken required.');
    return;
  }
  UserController.get(accessToken, res);
});

export default router;
