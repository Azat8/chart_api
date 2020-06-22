const AppError = require("../utils/AppError");
const responseManager = require('../utils/ResponseManager');
const TokenManager = require("../utils/TokenManager");
const User = require('../models/user.model');

async function auth(req, res, next) {
    let token = req.headers.authorization; 
    
    if(!token) {
        throw new Error('No access token');
    } else {
        let tokenManager = new TokenManager(process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24,
            algorithm: 'HS256',
            noTimestamp: false
        });

        const decoded = await tokenManager.decode(token, process.env.JWT_SECRET);
        
        try {
            if (decoded.uid) {
                const user = await User.findOne({_id: decoded.uid});
                if (user) {
                    next();
                } else {
                    throw new Error('Invalid token!');
                }
            } else {
                throw new Error('Invalid token!');
            }
        } catch (e) {
            throw new Error('Invalid token!');
        }
    }
    next();
}

module.exports = auth;