const AppError = require("../utils/AppError");
const responseManager = require('../utils/ResponseManager');

function auth(req, res, next) {
    const responseHandler = responseManager.getResponseHandler(res);

    if(!req.headers.authorization) {
        responseHandler.onError(new AppError('No access token!'));
    }
    next();
}

module.exports = auth;