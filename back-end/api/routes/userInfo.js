const UserInfoData = require('../models/userInfo.js');
const db = require('../models/database.js');
var express = require('express');
var router = express.Router();

var userInfoData = new UserInfoData();


router.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Content-Type', 'text/plain; charset = "utf-8"');
  userInfoData.getUserInfo((err, results) => {
    if (err) {
      console.error(err);
      res.send(JSON.stringify({
        status:'102',
        msg:'失败'
      }))
      return;
    }

    res.send(JSON.stringify({
      status:'200',
      msg:'成功',
      data:results
    }));
  });
});

router.all('/paging',(req, res)=>{
  res.header('Access-Control-Allow-Origin','*');

  var param = '';

  if(req.method == 'POST'){
    param = req.body;
  } else {
    param = req.query || req.params;
  }

  if(param.page == '' || param.page == null || param.page == undefined) {
    res.send(JSON.stringify({
      mgs:'请传入参数page',
      status:'101'
    }));
    return;
  }

  var start = (param.page - 1) * 9;
  var sql = 'select * from user_info limit ' + start + ',9';
  db.query(sql, (err, results)=>{
    if(err) {
      console.error(err);
      res.send(JSON.stringify({
        msg:'获取失败',
        status:'102',
      }))
    } else {
      res.send(JSON.stringify({
        status:'200',
        msg:'获取成功',
        data:results,
      }))
    }
  })
})

router.post('/insertone', (req,res)=>{
  res.header('Access-Control-Allow-Origin','*');
  const name = req.body.name,
        idenity = req.body.idenity,
        phone = req.body.phone,
        homeowners = req.body.homeowners,
        address = req.body.address,
        contract = req.body.contract;
  userInfoData.insertOne(name,idenity,phone,homeowners,address,contract, (err) => {
    if(err) {
      console.error(err);
      res.send(JSON.stringify({
        status:'102',
        msg:'错误',
      }));
      return ;
    }

    res.send(JSON.stringify({
      status:'200',
      msg:'成功',
      //userCount:count
    }))
  })
})

router.post('/del', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const id = req.body.user_id;
  console.log(id);
  userInfoData.deleteone(id, (err) =>{
    if (err) {
      console.error(err);
      res.send(JSON.stringify({
        status:'102',
        msg:'错误',
      }));
      return ;
    }
    
    res.send(JSON.stringify({
      status:'200',
      msg:'成功',
    }))
  })
})

router.post('/update', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  userInfoData.upadateone(req.body.name,req.body.identity,req.body.phone,req.body.homeowners,req.body.address,req.body.contract, (err) =>{
    if (err) {
      console.error(err);
      res.send(JSON.stringify({
        status:'102',
        msg:'错误',
      }));
      return ;
    }
    
    res.send(JSON.stringify({
      status:'200',
      msg:'成功'
    }))
  })
})

//获取用户总数量
router.get('/usercount', (req,res) =>{
  res.header('Access-Control-Allow-Origin','*');
    userInfoData.getCount((err, count)=>{
      if (err) {
        console.error(err);
        res.send(JSON.stringify({
          status:'102',
          msg:'错误',
        }));
        return ;
      }

      res.send(JSON.stringify({
        status:'200',
        msg:'成功',
        userCount:count
      }))
    })
})



module.exports = router;
