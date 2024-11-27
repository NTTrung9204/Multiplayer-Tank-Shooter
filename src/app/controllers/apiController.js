const userDB = require("../models/User")

class apiController {
    // [GET] /api/user/:_id
    getUserById(req, res) {
        const _id = req.params._id;

        userDB.findById(_id)
            .then((user) => {
                user = myUtils.getRecordMongoDB(user);
                const userFilter = myUtils.filterInforUser(user);
                res.send(userFilter);
            })
            .catch((err) => {
                res.send({ err: "User not found" });
            })
    }

    // [GET] /api/message
    getMessage(req, res) {
        const message = req.session.message;
        req.session.message = null;
        res.send(message);
    }

    // [GET] /api/friends/:_id
    getFriendList(req, res) {
        const _id = req.params._id;
        
        userDB.findById(_id, 'listFriend')
            .then((user) => {
                const friendList = user.listFriend.map(friendId => {
                    return userDB.findById(friendId, '_id username lastname firstname avatar');
                });

                Promise.all(friendList)
                    .then((friends) => {
                        res.send(friends);
                    })
                    .catch((err) => {
                        res.send({ err: "Error retrieving friend information" });
                    });
            })
            .catch((err) => {
                res.send({ err: "User not found" });
            });
    }
}

module.exports = new apiController();