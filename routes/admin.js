var express = require('express');
var router = express.Router();
var mongodb = require('mongodb')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var flash = require("express-flash")

const db = require('../database/db')

//upload
var multer = require('multer')

var users = db.get('user')

var storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./public/images')
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+".jpg")
  }
})
var upload = multer({storage:storage})

router.get('/project',enSureAuthenicated, function(req, res, next) {
  var projects = db.get('projects')
  projects.find({},{sort:{date:1}},function(err,project){
    res.render('adminproject',{projects:project})
  })
});

router.get('/project/add', function(req, res, next) {
  var projects = db.get('projects')
  projects.find({},{},function(err,project){
    res.render('addproject',{projects:project})
  })
});

router.post('/project/add',upload.single("image"),function(req,res,next){
  var projects = db.get('projects')
  if(req.file){
    var projectimage = req.file.filename
  }else{
    var projectimage = "No image"
  }
  projects.insert({
    name:req.body.name,
    description:req.body.description,
    date:req.body.date,
    image:projectimage
  },function(err,project){
    if(err){
      res.send(err)
    }else{
      res.location('/admin/project')
      res.redirect('/admin/project')
    }
  })
})

router.get('/project/edit/:id', function(req, res, next) {
  var projects = db.get('projects')
  projects.find(req.params.id,{},function(err,project){
    res.render('editproject',{projects:project})
  })
});

router.post('/project/edit',upload.single("image"),function(req,res,next){
  var projects = db.get('projects')
  //มีการแก้ไขและอัพโหลดภาพ
  if(req.file){
    var projectimage = req.file.filename
    projects.update({
      _id:req.body.id},{
        $set:{
          name:req.body.name,
          description:req.body.description,
          date:req.body.date,
          image:projectimage
        }
      },function(err,success){
        if(err){
          res.send(err)
        }else{
          res.location('/admin/project')
          res.redirect('/admin/project')
        }
      })
  }else{
    projects.update({
      _id:req.body.id},{
        $set:{
          name:req.body.name,
          description:req.body.description,
          date:req.body.date,
        }
      },function(err,success){
        if(err){
          res.send(err)
        }else{
          res.location('/admin/project')
          res.redirect('/admin/project')
        }
      })
  }

})

router.get('/project/delete/:id', function(req, res, next) {
  var projects = db.get('projects')
  projects.remove({_id:req.params.id})
  res.redirect('/admin/project')
});

router.get('/login',function(req,res,next){
  res.render('login')
})

router.post('/login',passport.authenticate('local',{
  failureRedirect:'/admin/login',
  failureFlash:true
}),
function(req,res,next){
  req.flash("success","ลงชื่อเข้าใช้แล้ว")
  res.redirect('/admin/project')
})

passport.serializeUser(function(user, done) {
  done(null, user[0]._id);
});
passport.deserializeUser(function(id, done) {
  users.find({_id:id}).then(function(row){
    var user = row[0]
    done(null,user)
  });
});

passport.use(new LocalStrategy(function(username,password,done){
  users.find({username:username},function(err,user){
    if(err) throw error
    if(user.length==0){
      return done(null,false,{ message: 'ไม่พบผู้ใช้งานนี้' })
    }
    if(user.length >0){
      if(user[0].password==password){
        return done(null,user)
      }else{
        return done(null,false,{ message: 'รหัสผ่านไม่ถูกต้อง' })
      }
  }
  })
}))

function enSureAuthenicated(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/admin/login')
  }
}

router.get('/logout',function(req,res,next){
  req.logout()
  res.redirect('/admin/login')
})

module.exports = router;
