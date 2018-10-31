const express = require('express');
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

//引入users
const users = require('./routes/api/users');

//引入profiles
const profiles = require('./routes/api/profiles');

//DB config
const db = require('./config/keys').mongoURL;

//使用bodyparser中间件
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

//初始化passport
app.use(passport.initialize());
require('./config/passport')(passport);

//连接数据库
mongoose.connect(db, {
  useNewUrlParser: true
}).then(() => {
  console.log('mongoDB 连接成功');
}).catch(e => console.log(e))

//
// app.get('/', (req, res) => {
//   res.send("hello world!")
// })

//使用routes
app.use('/api/users', users)
app.use('/api/profiles', profiles)

const port = process.env.Port || 5000

app.listen(port, () => {
  console.log(`running on port ${port}`);
})