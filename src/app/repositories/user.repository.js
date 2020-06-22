const User = require('../models/user.model');

class UserRepository {
    static create(userData) {
        return new User(userData).save();
    }

    static async findByEmail(email) {
        return await User.findOne({email});
    }
}

module.exports = UserRepository;