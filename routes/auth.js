const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt js");
const jwt_secret = "itsgood";
const fetchuser = require("../Middleware/fetchuser");

//code to check if the credintials are correct during sign in**********************************************************************************
//Router 1
router.post("/createuser", [body("email").isEmail()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //Encrypt password
  const salt = await bcrypt.genSalt(10);
  const secpass = await bcrypt.hash(req.body.password, salt);

  //passing data to database

  try {
    let user = await User.create({
      name: req.body.name,
      password: secpass,
      email: req.body.email,
    });
    const data = {
      user: {
        id: user.id,
      },
    };
    const jwt_data = jwt.sign(data, jwt_secret);

    success = true;
    res.json({ success, jwt_data });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }

  //res.json(obj);
  // console.log(req.body);
  // const user = User(req.body);
  // user.save();
  // res.send(req.body);
});

//code to check if the credintials are correct during Authentication**********************************************************************************
//Router 2
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({ error: "please emter correct credein" });
      }
      let passcmpr = await bcrypt.compare(password, user.password);
      if (!passcmpr) {
        return res
          .status(400)
          .json({ error: "please emter correct [password]" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(payload, jwt_secret);
      console.log(authtoken);
      success = true;
      res.json({ success, authtoken });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Internal server error", message: err.message });
    }
  }
);

//Get user details**********************************************************************************
// Router 3
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
});

module.exports = router;
