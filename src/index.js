const express = require('express')
const app = express()
const key = require('./config/main');
const {port, mongoURL} = key;
const path = require('path')
const { engine } = require('express-handlebars')
const db = require('./config/db')
const route = require('./routes')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Socket = require('./app/sockets/Socket');
const {configModuleService} = require('./config/moduleService/index');

configModuleService();
db(mongoURL);

global._io = io;

const passport = require('passport');

const session = require("express-session");
const sessionMiddleware = session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 10000000 },
});

app.use(sessionMiddleware);


app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.static(path.join(__dirname,'uploads')));

app.engine('hbs', engine({
    extname: '.hbs',
    helpers: {
        json: (context) => {
            return JSON.stringify(context);
        },
        condition: function (value1, value2, options) {
            if (value1 === value2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        notAnd: function (value1, value2) {
            return !value1 && !value2;
        }
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

app.use(express.json())
app.set('view engine', 'hbs')

app.set('views', path.join(__dirname, 'resource/views'))

// Sử dụng session middleware lấy socket.request và socket.request.res làm tham số cho req và res
global._io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

global._io.on('connection', Socket.connection);
route(app)

server.listen(port, () => console.log(`listening on port ${port}`))