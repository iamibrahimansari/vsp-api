const User = require("../models/user");
const bcrypt = require("bcrypt");
const path = require('node:path')
require('dotenv').config({path: path.join(__dirname, '..', '.env')})
const jwt = require('jsonwebtoken');

const userRegister = async (req, res) => {
  const {name, email, phone, profession, pwd, confirmpwd} = req.body;
  console.log(req.body);
    try {
      const hashedPass = await bcrypt.hash(req.body.pwd, 10);
      if(req.body.pwd !== req.body.confirmpwd){
        throw err;
      }
      const newUser = new User({
        username: name,
        email,
        phone,
        profession,
        password: hashedPass,
      });
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
}

const userLogin = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      !user && res.status(400).json("Wrong credentials!");
  
      const validated = await bcrypt.compare(req.body.pwd, user.password);
      !validated && res.status(400).json("Wrong credentials!");
      
      // jwt implement
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...others } = user._doc;
      res.cookie('access_token', token, { httpOnly: true }).status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
}

module.exports = {userRegister, userLogin};