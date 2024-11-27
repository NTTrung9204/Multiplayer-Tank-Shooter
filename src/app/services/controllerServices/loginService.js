class loginService {
    setSessionResponse(req, attributeObject) {
        for (const key in attributeObject) {
            req.session[key] = attributeObject[key];
        }
        req.session.save();
    }

    async verifyLogin(username, passport, req) {
        const user = await userRepository.findOne({ username });
        if (!user || !await userService.isValidPassword(passport, user.password)) {
            this.setSessionResponse(req, {
                message: {
                    status: 'failed',
                    title: 'Đăng nhập thất bại',
                    content: 'Tên đăng nhập hoặc mật khẩu không đúng'
                }
            });
            return false;
        }
        this.setSessionResponse(req, {
            username: user.username,
            user_id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            avatar: user.avatar,
            message: {
                status: 'success',
                title: 'Đăng nhập thành công',
                content: `Chào mừng ${user.username} đã quay trở lại`
            }
        });
        return true;
    }
}

module.exports = new loginService;
