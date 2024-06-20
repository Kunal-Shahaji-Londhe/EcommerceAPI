const expressJwt = require('express-jwt');
require('dotenv').config();

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    })
}

async function isRevoked(req, payload, done) {
    // Allow access for all routes except those that require admin access
    const isUpdatingUserProfile = req.path === `/api/v1/users/${payload._id}` && req.method === 'PUT';

    if (!payload.isAdmin || isUpdatingUserProfile) {
        done(null, false);
    } else {
        done(null, true);
    }
}



module.exports = authJwt