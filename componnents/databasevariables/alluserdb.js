const express = require("express");
const mongoose = require("mongoose");

const schemaa= new mongoose.Schema({
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
          validator: function(v) {
              return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
          },
          message: "Please enter a valid email"
      },
      required: [true, "Email required"]
    },
    usertype:{
      type:Number
    },
    verified:{
      type:Boolean,
      default:false
    }
});

const result = mongoose.model("user" , schemaa);

module.exports = result;