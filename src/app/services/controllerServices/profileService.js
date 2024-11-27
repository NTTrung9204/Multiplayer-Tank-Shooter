class profileService {
    async prepareProfileData(req) {
        const username = req.params.username;
        const user_id = req.session.user_id;
        var user = await userRepository.findOne({ username });
        const avatar = "/img/uploads/avatar/" + user.avatar;
        const numberOfFriends = user.listFriend.length;
        const isOwner = req.session.user_id === user._id.toString();
        const isFriend = user.listFriend.includes(req.session.user_id);
        return {
            user_id,
            username: req.session.username,
            userName: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            level: user.level,
            avatar,
            numberOfFriends,
            isOwner,
            isFriend,
        };
    }
}

module.exports = new profileService;
