const bcrypt = require("bcrypt");
const student = require("../../databasevariables/studentdb");
const path=require("../../../path");
const nodemailer=require("nodemailer");
const otpGenerator = require('otp-generator');
const signup = require("./signup");
require('dotenv').config();
const user = require("../../databasevariables/alluserdb");
const instructor = require("../../databasevariables/InstructorDB");
const admin = require("../../databasevariables/admindb");
const company = require("../../databasevariables/companyDB");
var Emailvalidator = require("email-validator");
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'udityap.davegroup@gmail.com',
      pass: process.env.EMAILPASSWORD
    }
  });

const result={
    get_enteremail:(req,res)=>{
        // res.sendFile(path+"/public/forgetenteremail.html");
        res.json({
          success:true,
          method:"post",
          ready:"post method here with email to verify email for forget password"
        })
    },
    post_enteremail:async (req , res)=>{
        const { email } = req.body;
        try{
          let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false});
          let indatabaseotpstored = false;
          var founduser = await signup.userexist(email);
          if (founduser){
            var resu;
            if(founduser.usertype== 11){

              resu =  await student.find({email:email});
              if(resu){
                const updat = await student.findOneAndUpdate({email:email}, {otp:otp , verified:false});
  
                console.log("updated for reset password : "+ updat );
                indatabaseotpstored = true;
  
              }else{
                res.json({
                  success:false,
                  msg:"User Not Found"
                });
              } 

            }else if (founduser.usertype== 12){

              resu =await instructor.find({email:email});
              if(resu){
                const updat = await instructor.findOneAndUpdate({email:email}, {otp:otp , verified:false});
  
                console.log("updated for reset password : "+ updat );
                indatabaseotpstored = true;
  
              }else{
                res.json({
                  success:false,
                  msg:"User Not Found"
                });
              } 

            }else if(founduser.usertype == 13){

              resu =await company.find({email:email});
              if(resu){
                const updat = await company.findOneAndUpdate({email:email}, {otp:otp , verified:false});
  
                console.log("updated for reset password : "+ updat );
                indatabaseotpstored = true;
  
              }else{
                res.json({
                  success:false,
                  msg:"User Not Found"
                });
              } 

            }else{
              resu = await admin.find({email:email});
              if(resu){
                const updat = await admin.findOneAndUpdate({email:email}, {otp:otp , verified:false});
  
                console.log("updated for reset password : "+ updat );
                indatabaseotpstored = true;
  
              }else{
                res.json({
                  success:false,
                  msg:"User Not Found"
                });
              } 
            }
            await user.findOneAndUpdate({email:email},{ verified : false });
            // const resu = await student.find({email:email});
            var mailOptions = {
              from: 'udityap.davegroup@gmail.com',
              to: email,
              subject: 'Reset Password for DAWAY',
              html: `<div style="max-width: 90%; margin: auto; padding-top: 20px">
            <p style="margin-bottom: 30px;">Please enter the OTP to get started</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${ otp }</h1></div>`
            };

            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                    console.log("not send : "+error);
                    res.json({success:false,msg:"otp not send to specified email"})
              } else {
                    if(indatabaseotpstored){
                      console.log('Email sent: ' + info.response);
                      res.json({
                          success:true,
                          msg:"OTP send Successfully."
                      });

                    }else{
                      res.json({
                        success:false,
                        msg:"OTP not stored in database but OTP send to email."
                      })
                    }
          
                    
              }
            });   
          }else{
            res.json({
              success:false,
              msg:"User does'nt exist"
            });
          }
           
        }catch{
          res.json({
            success:false,
            msg:"Internal Server Error."
          });

        }



    },
    post_otp_verification:
    async (req,res)=>{
      const {otp , email} = req.body ;
      if(Emailvalidator.validate(email) && otp && email){
          let founduser = await signup.userexist(email);
          if (founduser){

            // const resu = await student.find({ email : email});
            if(founduser.verified){
              var finduser;
              if(founduser.usertype == 11){

                finduser = await student.findOne({email:email});
                if(finduser.otp == otp){
  
                  const fin = await student.findOneAndUpdate({email : email},{otp : null , verified : true});
                  res.json({
                    success:true,
                    token:fin._id,
                    msg:"user verified successfully",
                    result:fin
                  });
    
                }else{
                  res.json({success:false,
                  msg:"Invalid OTP"});
                  
                }
      
              }else if (founduser.usertype == 12){
      
                finduser =await instructor.findOne({email:email});
                if(finduser.otp == otp){

                  const fin = await instructor.findOneAndUpdate({email : email},{otp : null , verified : true});
                
                  res.json({
                    success:true,
                    token:fin._id,
                    msg:"user verified successfully",
                    result:fin
                  });
    
                }else{
                  res.json({success:false,
                  msg:"Invalid OTP"});
                  
                }
      
              }else if(founduser.usertype == 13){
      
                finduser =await company.findOne({email:email});
                if(user.otp == otp){

                  const fin = await company.findOneAndUpdate({email : email},{otp : null , verified : true});
                
                  res.json({
                    success:true,
                    token:fin._id,
                    msg:"user verified successfully",
                    result:fin
                  });
    
                }else{
                  res.json({success:false,
                  msg:"Invalid OTP"});
                  
                }
      
              }else{
      
                finduser =await admin.findOne({email:email});
                if(finduser.otp == otp){

                  const fin = await admin.findOneAndUpdate({email : email},{otp : null , verified : true});
                
                  res.json({
                    success:true,
                    token:fin._id,
                    msg:"user verified successfully",
                    result:fin
                  });
    
                }else{
                  res.json({success:false,
                  msg:"Invalid OTP"});
                  
                }
              }
              await user.findOneAndUpdate({email:email},{verified:true});  
            }else{
              res.json({success:false,
                msg:"user is already verified exist"});
  
            }
          }else{
            res.json({success:false,
            msg:"user does'nt exist"});
          }
  
  
    }else{
      res.json({success:false,
        msg:"All fields required or invalid email"});
        
      }
    },
  Set_password: async (req,res)=>{
    let {email , password}= req.body;
          try{
            let founduser = await signup.userexist(email);
            if(founduser){
              let userj;
              if(founduser.usertype == 11){

                userj = await student.findOne({email:email});
                if(userj.verified){
                    const salt= parseInt(process.env.SALT);
                    const hashpassword = await bcrypt.hash(password, salt); 
                    const que = await student.findOneAndUpdate({email:email},{password:hashpassword});
                      console.log(que);
                      res.json({
                        success:true,
                        token:userj._id,
                        msg:"user password reset successfully"
                      });
              
                }else{
                  res.json({success:false,
                    msg:"This action is not possible."});
              
                }
      
              }else if (founduser.usertype == 12){
                
                userj =await instructor.findOne({email:email});
                if(userj.verified){
                  const salt= parseInt(process.env.SALT);
                  const hashpassword = await bcrypt.hash(password, salt); 
                  const que = await instructor.findOneAndUpdate({email:email},{password:hashpassword});
                    console.log(que);
                    res.json({
                      success:true,
                      token:userj._id,
                      msg:"user password reset successfully"
                    });
    
              }else{
                res.json({success:false,
                  msg:"This action is not possible."});
    
              }
      
              }else if(founduser.usertype == 13){
      
                userj =await company.findOne({email:email});
                if(userj.verified){
                  const salt= parseInt(process.env.SALT);
                  const hashpassword = await bcrypt.hash(password, salt); 
                  const que = await company.findOneAndUpdate({email:email},{password:hashpassword});
                    console.log(que);
                    res.json({
                      success:true,
                      token:userj._id,
                      msg:"user password reset successfully"
                    });
    
              }else{
                res.json({success:false,
                  msg:"This action is not possible."});
    
              }
      
              }else{
      
                userj =await admin.findOne({email:email});
                if(userj.verified){
                  const salt= parseInt(process.env.SALT);
                  const hashpassword = await bcrypt.hash(password, salt); 
                  const que = await admin.findOneAndUpdate({email:email},{password:hashpassword});
                    console.log(que);
                    res.json({
                      success:true,
                      token:userj._id,
                      msg:"user password reset successfully"
                    });
    
              }else{
                res.json({success:false,
                  msg:"This action is not possible."});
    
              }
              }
              // const query = await student.find({_id : id});
  

            }else{
              res.json({success:false,
                msg:"user doesn't exist"});

            }
          }catch(err){
            res.json({success:false,
              error:err,
              msg:"Some Internal server error"});
          }

  }

}

module.exports = result;