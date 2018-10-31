//login & register
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//测试
router.get('/test', (req, res) => {
  res.json({
    msg: "test success"
  })
})

//注册
router.post('/register', (req, res) => {
  // console.log(req.body);
  //查询数据库中是否存在
  User.findOne({
    email: req.body.email
  }).then((user) => {
    if (user) {
      return res.status(400).json('邮箱已被注册！')
    } else {

      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        identity: req.body.identity,
        avatar
      })

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err)
            throw err;
          newUser.password = hash;
          newUser.save().then(user => res.json(user)).catch(e => console.log(e))
        });
      });
    }
  })
})

//登录 token
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  //查询数据库
  User.findOne({
    email
  }).then(user => {
    if (!user) {
      return res.status(404).json('用户不存在！')
    } else {
      //密码匹配
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const rule = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            identity: user.identity
          }
          jwt.sign(rule, keys.secretOrKey, {
            expiresIn: 3600
          }, (err, token) => {
            if (err) throw err;
            res.json({
              success: true,
              token: "Bearer " + token
            })
          })
          // res.json({
          //   msg: 'success'
          // })
        } else {
          return res.status(400).json('密码错误！')
        }
      });
    }
  })
})

//当前请求的信息
router.get('/current', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    identity: req.user.identity
  })
})

module.exports = router;