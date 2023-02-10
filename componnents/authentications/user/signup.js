const bcrypt = require("bcrypt");
const path=require("../../../path");
var Emailvalidator = require("email-validator");
require('dotenv').config()
const nodemailer=require("nodemailer");
const otpGenerator = require('otp-generator');
const student = require("../../databasevariables/studentdb");
const user = require("../../databasevariables/alluserdb");
const instructor = require("../../databasevariables/InstructorDB");
const admin = require("../../databasevariables/admindb");
const company = require("../../databasevariables/companyDB");
 

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'udityap.davegroup@gmail.com',
    pass: process.env.EMAILPASSWORD
  }
});




const result={
post: async (req,res)=>{ 
    console.log(req.body);
    let {fname , lname ,password , email, usertype}= req.body;
    var hashedpassword;
    if(fname && lname && password && email && usertype){
        const salt= parseInt(process.env.SALT);
        hashedpassword = await bcrypt.hash(password, salt);
        email=email.toLowerCase();  
        try {

          if(Emailvalidator.validate(email)){
              if(await result.userexist(email)){
                res.json({success:false,
                msg:"user already exists"}); 
              }else{

                const newuser = new user({
                  email:email,
                  usertype:usertype
                  
                });
                await newuser.save();
                if(usertype == 11){
                  const user= new student({
                    fname:fname,
                    lname:lname,
                    password:hashedpassword,
                    email:email
                  });
                  await user.save().then((user)=>{
                    res.status(200).json({
                      success:true,
                      msg:"User Recorded Successfully"
                    });
                    // res.redirect("signup/verifyotp/"+email);
  
                  }).catch((err)=>{
  
                    res.status(400).json({
                      success:false,
                      error:err,
                      msg:"User not been recorded"
                    });
  
                  });

                }else if(usertype== 12){
                  const user= new instructor({
                    fname:fname,
                    lname:lname,
                    password:hashedpassword,
                    email:email
                  });
                  await user.save().then((user)=>{
                    res.status(200).json({
                      success:true,
                      msg:"User Recorded Successfully"
                    });
                    // res.redirect("signup/verifyotp/"+email);
  
                  }).catch((err)=>{
  
                    res.status(400).json({
                      success:false,
                      error:err,
                      msg:"User not been recorded"
                    });
  
                  });

                }else if(usertype == 13){
                  const user= new company({
                    fname:fname,
                    lname:lname,
                    password:hashedpassword,
                    email:email
                  });
                  await user.save().then((user)=>{
                    res.status(200).json({
                      success:true,
                      msg:"User Recorded Successfully"
                    });
                    // res.redirect("signup/verifyotp/"+email);
  
                  }).catch((err)=>{
  
                    res.status(400).json({
                      success:false,
                      error:err,
                      msg:"User not been recorded"
                    });
  
                  });
                }else if(usertype == 14){
                  const user= new admin({
                    fname:fname,
                    lname:lname,
                    password:hashedpassword,
                    email:email
                  });
                  await user.save().then((user)=>{
                    res.status(200).json({
                      success:true,
                      msg:"User Recorded Successfully"
                    });
                    // res.redirect("signup/verifyotp/"+email);
  
                  }).catch((err)=>{
  
                    res.status(400).json({
                      success:false,
                      error:err,
                      msg:"User not been recorded"
                    });
  
                  });
                }else{
                  res.status(400).json({
                    success:false,
                    msg:"Invalid user Type"
                  });
                }

            }
  
        }else{
          res.json({
              success:false,
              msg:"Invalid Email Format"
            });

        }
          
        } catch (error) {
          console.log("error:"+error);
      }
  
    }else{
        res.json({
        success:false,
        msg:"One of the field Found Missing"
      });
    }
  
  },
  get:(req,res)=>{
    res.json({
            status:200,
            msg:"ready to signup"
          });

    // res.sendFile(path+"/public/signup.html");
  },

  verifyotp : async (req , res)=>{
    let email=req.params['email'];
    let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false });

    if(Emailvalidator.validate(email)){
      const founduser = await result.userexist(email);
      if(founduser){

        // var u = await student.findOne({email : email});
        if(founduser.verified == true){
          res.json({
            success:false,
            msg:"user already verified"
          });
        }else{
          try{
            if(founduser.usertype== 11){

              await student.findOneAndUpdate({email:email},{otp:otp});

            }else if (founduser.usertype== 12){

              await instructor.findOneAndUpdate({email:email},{otp:otp});

            }else if(founduser.usertype == 13){

              await company.findOneAndUpdate({email:email},{otp:otp});

            }else{

              await admin.findOneAndUpdate({email:email},{otp:otp});
            }

            var mailOptions = {
                        from: 'udityap.davegroup@gmail.com',
                        to: email,
                        subject: 'Verify Email from DAWAY',
                        html: `
                    <div
                      class="container"
                      style="max-width: 90%; margin: auto; padding-top: 20px"
                    >
                      <h2>Welcome to DAWAY.</h2>
                      <h4>Greatings of the day </h4>
                      <p style="margin-bottom: 30px;">Please enter the OTP to get started</p>
                      <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
                 </div>`
            };

            transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log("not send :"+error);
                        } else {
                          console.log('Email sent: ' + info.response);
                          res.json({success:true,
                          msg:"OTP send to email"});
                        }
            });

            // res.sendFile(path+"/public/signupotpverification.html");



          }catch(err){
            res.json({
                        success:false,
                        msg:"Either email invalid or backend nodemailer email invalid"
            });

          }
        }

      }else{
        res.json({
          success:false,
          msg:"Email does not exist"
        });
      }
    }else{
      res.json({
        success:false,
        msg:"Invalid Email Format"
      });
    }
    

  },
  userexist: async (email)=>{
    var u = await user.find({email : email});
    if(u.length!=0){
      console.log("user found\n");
      return u[0];
    }
    else{
      console.log("user not found\n");
      return false; 
    }

  },
  checkotp:async (req,res)=>{
    const {otp}=req.body;
    const email= req.params['email'];

    if(Emailvalidator.validate(email) && otp){

      const resu = await result.userexist(email);
        if(resu){
        if (resu.verified === false){
          if(resu.usertype == 11){

            var reel = await student.findOne({email:email});
            if(reel.otp == otp){
              var resul = await student.findOneAndUpdate({email:email},{otp:null,verified:true});
              await user.findOneAndUpdate({email:email},{verified:true});
              console.log(resul);
              res.json({
                success:true,
                token:resul._id,
                result:resul,
                msg:"user verified successfully"
              });

            }else{
              res.json({success:false,
              msg:"Invalid OTP"});
              
            }

          }else if (resu.usertype== 12){

            var reel = await instructor.findOne({email:email});
            if(reel.otp == otp){
              var resul = await instructor.findOneAndUpdate({email:email},{otp:null,verified:true});
              await user.findOneAndUpdate({email:email},{verified:true});
              console.log(resul);
              res.json({
                success:true,
                token:resul._id,
                result:resul,
                msg:"user verified successfully"
              });


            }else{
              res.json({success:false,
              msg:"Invalid OTP"});
              
            }

          }else if(resu.usertype == 13){

            var reel = await company.findOne({email:email});
            if(reel.otp == otp){
              var resul = await company.findOneAndUpdate({email:email},{otp:null,verified:true});
              await user.findOneAndUpdate({email:email},{verified:true});
              console.log(resul);
              res.json({
                success:true,
                token:resul._id,
                result:resul,
                msg:"user verified successfully"
              });


            }else{
              res.json({success:false,
              msg:"Invalid OTP"});
              
            }

          }else{

            var reel = await admin.findOne({email:email});
            if(reel.otp == otp){
              var resul = await admin.findOneAndUpdate({email:email},{otp:null,verified:true});
              await user.findOneAndUpdate({email:email},{verified:true});
              console.log(resul);
              res.json({
                success:true,
                token:resul._id,
                result:resul,
                msg:"user verified successfully"
              });


            }else{
              res.json({success:false,
              msg:"Invalid OTP"});
              
            }
          }
          }else{
              res.json({success:false,
              msg:"user is already verified"});
              
            }
          }else{
            res.json({success:false,
            msg:"user doesn't exist"});
        }


  }else{
    res.json({success:false,
      msg:"otp required or email invalid"});
  }
}
};

module.exports = result;