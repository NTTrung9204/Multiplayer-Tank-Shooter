class LoginController {
    // [GET] /login
    index(req, res) {
        res.render('login')
    }

    // [POST] /login
    async loginUser(req, res) {
        const { username, password } = req.body;
        const result = await loginService.verifyLogin(username, password, req);
        result ? res.redirect('/') : res.redirect('/login');
    }
}

module.exports = new LoginController