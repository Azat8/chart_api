const {validationResult} = require('express-validator');
const AppError = require('./AppError');
const responseManager = require('./ResponseManager');

module.exports = (req, res, next) => {
    const responseHandler = responseManager.getResponseHandler(res);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return responseHandler.onError(new AppError('Validation Error', 403), {errors: errors.mapped()});
    }
    next();
};