function errorHandler(err, req, res, next) {
   if (err.name === 'UnauthorizedError') {
       // jwt authentication error
       if (req.path === '/api/v1/users' && req.method === 'POST' || req.method === 'PUT' ) {
        return next();
      }

      // jwt authentication error
      if (req.path === '/api/v1/reviews' && req.method === 'POST' || req.method === 'PUT' || req.method === 'GET' ) {
        return next();
      }

      // jwt authentication error
      if (req.path === '/api/v1/return' && req.method === 'DELETE' || req.method === 'POST' || req.method === 'GET' ) {
        return next();
      }

       // Exclude payment initiation endpoint
    if (req.path === '/process_payment' && req.method === 'POST') {
        return next();
    }

       return res.status(401).json({message: "The user is not authorized"})
   }

   if (err.name === 'ValidationError') {
       //  validation error
       return res.status(401).json({message: err})
   }

   // default to 500 server error
   return res.status(500).json(err);
}

module.exports = errorHandler;