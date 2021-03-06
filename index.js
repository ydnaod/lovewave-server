const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/usersRouter')
const pool = require('./db');
const loginRouter = require('./routes/login')
const profileRouter = require('./routes/profile')
const jwtRouter = require('./routes/jwtAuth');
const lyricsRouter = require('./routes/lyrics');
const fetchProfilesRouter = require('./routes/fetchProfiles')
const swipesRouter = require('./routes/swipes');
const conversationsRouter = require('./routes/conversations')

const PORT = process.env.PORT || 4000;

const app = express();

//middleware
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  next();
});
app.use(express.json());

//routes
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/account', jwtRouter);
app.use('/lyrics', lyricsRouter);
app.use('/fetch-profiles', fetchProfilesRouter);
app.use('/swipes', swipesRouter);
app.use('/conversations', conversationsRouter);

app.get('/', (req, res) => {
  console.log('welcome!')
  res.send('yo!')
})

//socket.io 
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
      origin: 'https://www.lovewav.io',
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

io.on('connection', (socket) => {

    const { id } = socket.handshake.query;
    socket.join(id);

    console.log('a user has connected to room ' + id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.leave(id);
      });

    socket.on('chat message', (msg) => {
      console.log(msg)
      const query = pool.query('insert into message (user_account_id, conversation_id, message) values ($1, $2, $3)', [msg.userId, msg.conversationId, msg.body]);
      //socket.broadcast.emit('chat message', msg);
      io.in(id).emit('chat message', msg);
    })
});

http.listen(PORT, () => {
    console.log('listening on ' + PORT)
})