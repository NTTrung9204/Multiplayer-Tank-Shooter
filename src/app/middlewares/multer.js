const userDB = require("../models/User")
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/img/uploads/avatar');
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
       
        const filename = req.session.user_id;
        userDB.findByIdAndUpdate(req.session.user_id, { avatar: filename + extension })
            .then((user) => {
                if (user.avatar !== "defaultAvatar.png") {
                    const oldAvatarPath = path.join(__dirname, '..', '..', 'public/img/uploads/avatar', user.avatar);
                    fs.unlink(oldAvatarPath, (err) => {
                        if (err) {
                            console.log("loi 121:", err);
                        } else {
                            console.log('Da xoa anh cu');
                        }
                    });
                }
                cb(null, filename + extension);
            })
            .catch((error) => {
                console.log("Loi 122:", error);
            })
    }
});

const upload = multer({ storage: storage });

module.exports = upload;