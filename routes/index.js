var express = require('express');
var router = express.Router();
var userModel = require('../modules/user');
var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check , validationResult} = require('express-validator');
var getPassCat = passCatModel.find({});
var getAllPass = passModel.find({});

function checkLoginUser(req,res,next){
  userToken = localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken , 'loginToken');
  }
  catch(err) {
    res.redirect('/');
  }
  next();
}

if(typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');

}

/* GET home page. */

router.get('/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser)
  {
    res.redirect('./dashboard');
  }else{
    res.render('index', { title: 'Password Management System',msg:'' });
  }
 
});

router.get('/dashboard', checkLoginUser , function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  res.render('dashboard', { title: 'Password Management System', loginUser:loginUser, msg:'' });
});

//Login 
router.post('/', function(req, res, next) {

  var username = req.body.uname;
  var password = req.body.password;
  var checkUser = userModel.findOne({username: username});
  checkUser.exec((err , data) => {
    if(err) throw err;
    var getUserID = data._id;
    var getPassword = data.password;
    if(bcrypt.compareSync(password , getPassword)){
      var token = jwt.sign({userID: getUserID}, 'loginToken');
      localStorage.setItem('userToken' , token);
      localStorage.setItem('loginUser' , username);
      res.redirect('/dashboard');
    }
    else{
      res.render('index', { title: 'Password Management System',msg:'Invalid Username or Password !' });
    }

  });

});

function checkUsername(req, res, next){
  var uname = req.body.uname;
  var checkexitemail = userModel.findOne({username: uname});
  checkexitemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password Management System', msg:'Username already exist' });

    }
    next();
  });
}


function checkEmail(req, res, next){
  var email=req.body.email;
  var checkexitemail = userModel.findOne({email: email});
  checkexitemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password Management System', msg:'Email already exist' });

    }
    next();
  });
}


router.get('/signup', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser)
  {
    res.redirect('./dashboard');
  }else{
    res.render('signup', { title: 'Password Management System', msg:'' });
  }
});

router.post('/signup', checkUsername, checkEmail,  function(req, res, next) {
  
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var confpassword=req.body.confpassword;

  if(password != confpassword)
  {
    res.render('signup', { title: 'Password Management System', msg:'Oops , Password not matched!' }); 
  }
  else{
    password = bcrypt.hashSync(req.body.password , 10);
  var userDetails = new userModel({
    username:username,
    email:email,
    password:password
  });  

  userDetails.save((err , doc)=>{
    if(err) throw err;
    res.render('signup', { title: 'Password Management System', msg:'User Registered Successfully' });
  });
  }

  
});



router.get('/passwordCategory', checkLoginUser , function(req, res, next) {
  
  var loginUser=localStorage.getItem('loginUser');
  getPassCat.exec(function(err,data){
    if(err) throw err;
  
  res.render('password_category', { title: 'Password Management System' , loginUser: loginUser , errors: '' , success:'' , records:data });
  });
});

router.get('/passwordCategory/delete/:id', checkLoginUser , function(req, res, next) {
  
  var passcat_id = req.params.id;
  var passdelete = passCatModel.findByIdAndDelete( passcat_id);
  passdelete.exec(function(err){
    if(err) throw err;
    res.redirect('/passwordCategory');
 });
});

router.get('/passwordCategory/edit/:id', checkLoginUser , function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcat_id = req.params.id;
  var getpassCategory = passCatModel.findById( passcat_id);
  getpassCategory.exec(function(err,data){
    if(err) throw err;
    res.render('edit_pass_category', { title: 'Password Management System' , loginUser: loginUser , errors: '' , success:'' , records:data , id:passcat_id });
  });
});

router.post('/passwordCategory/edit/', checkLoginUser , function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcat_id = req.body.id;
  var passwordCategory = req.body.passwordCategory;
  var update_passCat = passCatModel.findByIdAndUpdate( passcat_id,{password_category: passwordCategory });
  update_passCat.exec(function(err,doc){
    if(err) throw err;
    res.redirect('/passwordCategory');
  });
});


router.get('/add-new-category', checkLoginUser , function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
 
    res.render('addNewCategory', { title: 'Password Management System' , loginUser: loginUser , errors: '' , success:''  });
 
});

router.post('/add-new-category', checkLoginUser , [check('passwordCategory','Enter Password Category Name').isLength({ min : 1})] , function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.render('addNewCategory', { title: 'Password Management System' , loginUser: loginUser , errors:errors.mapped() , success:'' });
  }else{
    var passCatName = req.body.passwordCategory;
    var passcatDetails = new passCatModel({
      password_category: passCatName
    });
    passcatDetails.save(function(err,doc){
      if(err) throw err;
      res.render('addNewCategory', { title: 'Password Management System' , loginUser: loginUser , errors: '' , success:'Password Category Inserted Successsfully!'});
    })
    
  }
  
});

router.get('/add-new-password', checkLoginUser , function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  getPassCat.exec(function(err,data){
    if(err) throw err;
    res.render('add-new-password', { title: 'Password Management System' , loginUser: loginUser , records: data , success : ''});
  });
  
});

router.post('/add-new-password', checkLoginUser , function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var pass_cat = req.body.pass_cat;
  var project_name = req.body.project_name;
  var pass_details = req.body.pass_details;
  var password_details = new passModel({
    password_category: pass_cat,
    project_name: project_name,
    password_details: pass_details
  });
  

    password_details.save(function(err,doc){
      getPassCat.exec(function(err,data){
        if(err) throw err;

      res.render('add-new-password', { title: 'Password Management System' , loginUser: loginUser , records: data , success : "Password Details Inserted Successfully"});
    });
    
  });
  
});

router.get('/view-all-password/', checkLoginUser , function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  getAllPass.exec(function(err , data){
    if(err) throw err;
    res.render('view-all-password', { title: 'Password Management System' , loginUser: loginUser , records:data });
  });
  
});

router.get('/password-detail/', checkLoginUser , function(req, res, next) {
  res.redirect('/dashboard');
});

router.get('/password-detail/edit/:id', checkLoginUser , function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var id = req.params.id;
  var getPassDetails = passModel.findById({_id:id});
  getPassDetails.exec(function(err , data){
    if(err) throw err;
    getPassCat.exec(function(err,data1){
    res.render('edit_password_detail' , { title: 'Password Management System' , loginUser: loginUser, records:data1 , record : data ,success:'' });
  });
  });
});

router.post('/password-detail/edit/:id', checkLoginUser , function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var id = req.params.id;
  
  var passcat = req.body.pass_cat;
  var project_name = req.body.project_name;
  var password_details = req.body.password_details;

  passModel.findByIdAndUpdate(id , {password_category: passcat , project_name: project_name , password_details:password_details }).exec(function(err){
    if(err) throw err;
    var getPassDetails = passModel.findById({_id:id});

  getPassDetails.exec(function(err , data){
    if(err) throw err;
    getPassCat.exec(function(err,data1){
    res.render('edit_password_detail'+id , { title: 'Password Management System' , loginUser: loginUser, records:data1 , record : data ,success:'Password Updated Successfully !' });
  });
  });
});
});

router.get('/password-detail/delete/:id', checkLoginUser , function(req, res, next) {
  
  var id = req.params.id;
  var passdelete = passModel.findByIdAndDelete( id);
  passdelete.exec(function(err){
    if(err) throw err;
    res.redirect('/view-all-password/ ');
 });
});

router.get('/logout', function(req, res, next) {
 localStorage.removeItem('userToken');
 localStorage.removeItem('loginUser');
 res.redirect('/');
});

module.exports = router;
