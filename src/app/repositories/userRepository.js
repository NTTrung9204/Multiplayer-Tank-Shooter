const userDB = require('../models/User');

class userRepository {
    findOne(query) {
        return userDB.findOne(query);
    }

    findRank(page, limit) {
        const skip = (page - 1) * limit;

        return userDB.find()
            .sort({ exp: -1 })
            .skip(skip)
            .limit(limit);
    }

    countDocuments() {
        return userDB.countDocuments();
    }

    create(information) {
        return userDB.create(information);
    }

    findByIdAndUpdate(id, update) {
        return userDB.findByIdAndUpdate(id, update);
    }

    findUsers(condition){
        return userDB.find(condition);
    }
}

module.exports = new userRepository;