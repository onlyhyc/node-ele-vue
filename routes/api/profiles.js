//login & register
const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const passport = require('passport');

//测试
// router.get('/test', (req, res) => {
//   res.json({
//     msg: "profile success"
//   })
// })
//添加数据
router.post('/add', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const profileFields = {}

  if (req.body.type) profileFields.type = req.body.type;
  if (req.body.describe) profileFields.describe = req.body.describe;
  if (req.body.income) profileFields.income = req.body.income;
  if (req.body.expend) profileFields.expend = req.body.expend;
  if (req.body.cash) profileFields.cash = req.body.cash;
  if (req.body.remark) profileFields.remark = req.body.remark;

  new Profile(profileFields).save().then(profile => {
    res.json(profile);
  })
})

//获取全部数据
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.find().then(profile => {
    if (!profile) {
      return res.status(404).json('当前没有数据')
    } else {
      res.json(profile)
    }
  }).catch(e => res.status(404).json(e))
})

//获取单个数据
router.get('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
    _id: req.params.id
  }).then(profile => {
    if (!profile) {
      return res.status(404).json('当前没有数据')
    } else {
      res.json(profile)
    }
  }).catch(e => res.status(404).json(e))
})

//编辑数据
router.post('/edit/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const profileFields = {}

  if (req.body.type) profileFields.type = req.body.type;
  if (req.body.describe) profileFields.describe = req.body.describe;
  if (req.body.income) profileFields.income = req.body.income;
  if (req.body.expend) profileFields.expend = req.body.expend;
  if (req.body.cash) profileFields.cash = req.body.cash;
  if (req.body.remark) profileFields.remark = req.body.remark;

  Profile.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: profileFields
  }, {
    new: true
  }).then(profile => {
    res.json(profile)
  }).catch(e => console.log(e))
})

//删除数据
router.delete('/delete/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOneAndDelete({
    _id: req.params.id
  }).then(profile => {
    profile.save().then(result => {
      res.json(result)
    }).catch(e => res.status(404).json(`删除失败！`))
  })
})

module.exports = router;