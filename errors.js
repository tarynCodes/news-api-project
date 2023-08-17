exports.psqlErrors = ((err, request, response, next) => {
    if (err.code === '22P02'||err.code === '23502'){
      response.status(400).send({ msg: 'Bad Request!' });
    }else{
      next(err)
    }
  })


exports.customErrors = ((err, req, res, next) => {
    if(err.status && err.msg) {
      res.status(err.status).send({msg: err.msg})
    }else{
      next(err)
    }
  })

exports.handles404 = ((err, request, response, next) => {
    if (err.status === 404 || err.code === '23503') {
      response.status(404).send({ msg: 'Invalid input!' });
    } else {
      next(err);
    }
  });