const upload = require("../middlewares/multer");
const userDB = require("../models/User");

class ProfileController {
    async index(req, res) {
        const { user_id, username, userName, firstname, lastname, level, avatar, numberOfFriends, isOwner, isFriend } =
            await profileService.prepareProfileData(req);
        
        res.render("profile", { user_id, username, userName, firstname, lastname, level, avatar, numberOfFriends, isOwner, isFriend });
    }

    uploadImage(req, res) {
        upload.single("avatar")(req, res, function (err) {
            if (err) {
                console.log("Loi 120:", err);
                res.redirect("/profile");
            } else {
                console.log("thay doi thanh cong");
                res.redirect("/profile");
            }
        });
    }
}

module.exports = new ProfileController();
