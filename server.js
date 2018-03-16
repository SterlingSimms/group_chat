let express     = require('express')
    app         = express(),
    path        = require('path'),
    session     = require('express-session'),
    body_parser = require('body-parser');

app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(session({
    secret: '^P%mUWCwF4hWAhtgUb8BrRqWPuR$%4w^@FSB3j*VfumMEJB8SPpr57%aqRmsEyHGhJKcvgu9#W&5ZvUrCZ*q4c%8^A9RJ49@Mf3X',
    proxy: true,
    resave: false,
    saveUninitialized: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Example get route
app.get('/', (req, res) => {
  res.render('index');
})

// Other routes

let server = app.listen(6789, () => {
    console.log("listening on port 6789");
});
const users = {};
let io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    socket.emit('login');
    socket.on('user_name', function(username){
        socket.username = username
        socket.emit('ready_chat');
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', msg, {this_user: socket.username});
    });
});
