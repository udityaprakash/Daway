const bcrypt = require("bcrypt");
const path=require("../../../path");
const student= require("../../databasevariables/studentdb");
const user = require("../../databasevariables/alluserdb");
const instructor = require("../../databasevariables/InstructorDB");
const admin = require("../../databasevariables/admindb");
const company = require("../../databasevariables/companyDB");

const result = {

  post: async (req,res) => {
    console.log(req.body);
    let { email , password } = req.body;
    if( email && password ){
      email = email.toLowerCase();
      const founduser = await user.findOne({ email: email });
      // console.log(result);
      if(founduser){
        let userj;
        if(founduser.usertype == 11){

          userj = await student.findOne({email:email});

        }else if (founduser.usertype == 12){

          userj =await instructor.findOne({email:email});

        }else if(founduser.usertype == 13){

          userj =await company.findOne({email:email});

        }else{

          userj =await admin.findOne({email:email});
        }
        const match =await bcrypt.compare(password, userj.password);
        if(match){
              // console.log(result[0].verified);
              if(userj.verified == true){

                res.status(200).json({
                  success:true,
                  msg:"User Exist",
                  redirecturl:"user/dashboard/"+userj._id
                });
                // res.redirect("dashboard/"+ result[0]._id);

              }else{
                // res.redirect("signup/verifyotp/" + email );
                res.json({
                  success:false,
                  msg:"user not verified yet please verify",
                  redirecturl:"user/signup/verifyotp/<email>"
                });
              }

            }else{
              res.status(401).json({
                success:false,
                msg:"Password incorrect"
              });

            }


          }else{
            res.status(404).json({
              success:false,
              msg:"Email ID don't exist"
            });
          }
  
  
    }else{
      res.status(400).json({success:false,
      msg:"One of the field Found Missing"});
  }
  },
  get:(req,res)=>{
    res.json({
      status:200,
      msg:"ready to login"
    })
    // res.sendFile(path+"/public/login.html");
  }
}

module.exports = result;