export default {
  post(req, res, cb) {
    res.status(200).send({message: 'success'});
    return cb();
  }
};
