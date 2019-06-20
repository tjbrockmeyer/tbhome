
const ezjwt = require('@brockmeyer-tyler/ezjwt');


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
  }
};

