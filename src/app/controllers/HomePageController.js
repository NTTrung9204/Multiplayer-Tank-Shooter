class HomePageController {
    index(req, res) {
        const username = req.session.username;
        res.render("homePage/HomePage", { username: username });
    }
}

module.exports = new HomePageController();
