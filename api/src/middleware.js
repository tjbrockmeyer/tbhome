
const ezjwt = require('@brockmeyer-tyler/ezjwt');
const {PSQLError} = require('@brockmeyer-tyler/psql-client');


module.exports = {
  requireAuth(scopes) {
    return async function (req, res, next) {
      const token = req.get('x-access-token');
      if(!token) {
        res.status(401).send();
      } else {
        req.token = ezjwt.decode(token);
        next();
        // If not authorized after authentication,
        // res.status(503).send()
      }
    }
  },
  async errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
  },
  async errorResponseHandler(req, resObj, err) {
    if(err) {
      if(err instanceof PSQLError) {
        if(err.code === PSQLError.codes.conflict) {
          resObj.body = undefined;
          resObj.status = 409;
        } else if(err.code === PSQLError.codes.connection) {
          resObj.body = {message: 'could not connect to the database', details: err.message};
          resObj.status = 500;
        }
      }
    }
  }
};

