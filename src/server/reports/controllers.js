export default {

  // @TODO you need to implement report method
  post(req, res, cb) {
    res.status(200).send({message: 'success'});
    return cb();
  }
};
