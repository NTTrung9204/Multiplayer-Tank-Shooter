const loginService = require("./loginService");

class registerService{
    async verifyCreateUser(username, email){
        const usernameQuery = await userRepository.findOne({ username });
        const emailQuery = await userRepository.findOne({ email });
        if (usernameQuery || emailQuery) {
            return false;
        }
        return true;
    }

    async createUser(req){
        const information = req.body;
        if (!await this.verifyCreateUser(information.username, information.email)) {
            loginService.setSessionResponse(req, {
                message: {
                    status: 'failed',
                    title: 'Đăng ký thất bại',
                    content: 'Tên đăng nhập hoặc email đã tồn tại'
                }
            });
            return false;
        }
        information.password = await userService.encodePassword(information.password);
        const user = await userRepository.create(information);
        if(!user){
            loginService.setSessionResponse(req, {
                message: {
                    status: 'failed',
                    title: 'Đăng ký thất bại',
                    content: 'Đã có lỗi xảy ra'
                }
            });
            return false;
        };
        loginService.setSessionResponse(req, {
            message: {
                status: 'success',
                title: 'Đăng ký thành công',
                content: `Chúc mừng bạn đã đăng ký thành công`
            }
        });

        return myUtils.getRecordMongoDB(user);
    }
}

module.exports = new registerService;