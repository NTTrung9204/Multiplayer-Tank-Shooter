const homePageRouter = require('./homePageRouter');
const loginRouter = require('./loginRouter');
const logoutRouter = require('./logoutRouter');
const registerRouter = require('./registerRouter');
const gamemodeRouter = require('./gamemodeRouter');
const playRouter = require('./playRouter');
const adminRouter = require('./adminRouter');
const profileRouter = require('./profileRouter');
const historyRouter=require('./historyRouter');
const apiRouter = require('./apiRouter');
const settingsRouter = require('./settingsRouter');
const rankRouter = require('./rankRouter');
const replayRouter = require('./replayRouter');
const chatRouter = require('./chatRouter');

const checkLogin = require('../app/middlewares/checkLogin');

function routes(app) {
    app.use('/chat', chatRouter);
    app.use('/replay', replayRouter);
    app.use('/admin', adminRouter);
    app.use('/rank', rankRouter);
    app.use('/settings', settingsRouter);
    app.use('/login', loginRouter);
    app.use('/logout', logoutRouter);
    app.use('/register', registerRouter);
    app.use('/gamemode', gamemodeRouter);
    app.use('/play', playRouter);
    app.use('/profile', profileRouter);
    app.use('/history', historyRouter);
    app.use('/api', apiRouter);
    app.use('/', homePageRouter);
}

module.exports = routes;