class RegisterController {
    // [GET] /register
    index(req, res) {
        res.render('register');
    }

    // [POST] /register
    async registerUser(req, res) {
        const user = await registerService.createUser(req);
        if (!user) {
            res.redirect("/register");
            return;
        }
        res.redirect("/login");
    }
}
module.exports = new RegisterController