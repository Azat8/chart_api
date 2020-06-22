const AppError = require("../utils/AppError");
const responseManager = require('../utils/ResponseManager');
const TokenManager = require("../utils/TokenManager");
const User = require('../models/user.model');

async function auth(req, res, next) {
    const responseHandler = responseManager.getResponseHandler(res);
    let token = req.headers.authorization; 
    if(!token) {
        responseHandler.onError(new AppError('No access token!'));
    } else {
        try {
            const decoded = await TokenManager.decode(token, process.env.JWT_SECRET);
            if (decoded.uid) {
                const user = await User.findOne({_id: decoded.uid});
                if (user) {
                    next();
                } else {
                    return responseHandler.onError(new AppError("Invalid credentials", 401));
                }
            } else {
                return responseHandler.onError(new AppError("Invalid Access Token.", 403));
            }
        } catch (e) {
            return responseHandler.onError(new AppError("Invalid Access Token.", 401));
        }
    }
    next();
}

module.exports = auth;