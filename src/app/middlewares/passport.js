const passport = require("passport");
const LocalStrategy = require("passport-local");
const userDB = require("../models/User");

passport.use(
    "local-register",
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        async (username, password, done) => {
            try {
                const user = await userDB.findOne({ username: username });
                
                if (user) {
                    return done(null, false, { message: "Username đã tồn tại" });
                }
                done(null, user, { message: "Đăng ký thành công" });
            } catch (error) {
                done(error, false, { message: "Đăng ký thất bại, lỗi của server" });
            }
        }
    )
);

passport.use(
    "local-login",
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        async (username, password, done) => {
            try {
                const user = await userDB.findOne({ username: username });
                if (!user) {
                    return done(null, false, { message: "username không tồn tại" });
                }
                const isCorrectPassword = await user.isValidPassword(password);
                if (!isCorrectPassword) {
                    return done(null, false, { message: "Sai mật khẩu" });
                }
                done(null, user, { message: "Đăng nhập thành công" });
            } catch (error) {
                done(error, false, { message: "Đăng nhập thất bại, lỗi của server" });
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userDB.findById(id);
        console.log(user);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
