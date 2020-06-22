const UserRepository = require('../repositories/user.repository');
const TokenManager = require('../utils/TokenManager');
const AppError = require('../utils/AppError');
const BCrypt = require('../utils/BCrypt');
const responseManager = require('../utils/ResponseManager');
const User = require('../models/user.model');

class UserController {
    static async create(userData, cb) {
        let user = await UserRepository.create(userData);
        if(user) {
            cb.onSuccess(user, 'User created successfully!');
        } else {
            cb.onError('Somthing went wrong!');
        }
    }

    static async login(credentials, callback) {
        const responseHandler = responseManager.getResponseHandler(callback);
        let {email, password} = credentials;
        let user = await UserRepository.findByEmail(email);
        
        if(user) {
            let {username} = user;
            const doesPasswordMatch = await BCrypt.compare(password, user.password);
            
            if (!doesPasswordMatch) {
                return responseHandler.onError(new AppError('Wrong username or password', 404));
            }

            let token = new TokenManager(process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 24,
                algorithm: 'HS256',
                noTimestamp: false
            });

            token = token.encode({
                uid: user._id
            });

            callback.send({token});

        } else {
            return responseHandler.onError(new AppError('Wrong username or password', 404));
        }
    }

    static async getUsers(req, res) {
        let q = {};
        if(req.date) {
            let date = new Date(req.date);
            let createdAt = {};
            createdAt.$gt = new Date(req.date);
            createdAt.$lt = new Date(date.setDate(date.getDate() + 1)); 
            q.createdAt = createdAt;
        }
        
        let users = await User.find(q);
        res.onSuccess(users);
    }
}

module.exports = UserController;