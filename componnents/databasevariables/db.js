const express = require("express");
const student = require("./studentdb");
const alluser = require("./alluserdb");
const company = require("./companyDB");
const instructor = require("./InstructorDB");
const admin = require("./admindb");

require('dotenv').config();
const mongoose = require("mongoose");
var i=0;

const connectDB =  {
  connection: async () => {
            await mongoose.set("strictQuery", false);
            await mongoose.connect("mongodb://localhost:27017/daway", (err) => {   
              if (!err) {
                console.log("db connected successfully");
                try{
                  student;
                  alluser;
                  admin;
                  instructor;
                  company;
                }catch(err){
                  console.log("error in schema: "+err);
                  }
                } else {
                  console.log("Retrying connecting to database : " + i++);
                  connectDB.connection();
                }
              });
            }
            
          }
          
          
module.exports=connectDB;