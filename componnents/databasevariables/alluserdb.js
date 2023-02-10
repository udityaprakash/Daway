const express = require("express");
const mongoose = require("mongoose");

const schema= new mongoose.Schema({
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
    }
});

const result = mongoose.model("Alluser" , schema);

module.exports = result;