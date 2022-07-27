const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "atishay@jain";

//ROUTE : 1  create a user using POST "/api1/auth/createuser" no login required

router.post(
  "/createuser",

  body("name", "Enter a valid Name").isLength({ min: 3 }),
  body("password", "Password must have atleast 5 characters").isLength({
    min: 5,
  }),
  body("email", "Enter a valid Email").isEmail(),

  async (req, res) => {
    let sucess = false;
    //if there are error in credentials Bad request will be sent
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({sucess, errors: errors.array() });
    }

    //check whether the user exist with same email
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({sucess, error: "Sorry a user with this email already exists" });
      }

      //generating salt for password to secure the password
      const salt = bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      //generating authentication token for user
      const authToken = jwt.sign(data, JWT_SECRET);
      sucess = true
      res.json({sucess, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ROUTE : 2  authenticate a user using POST "/api1/auth/login" no login required

router.post(
  "/login",
  body("email", "Enter a valid Email").isEmail(),
  body("password", "Password cannot be blank").exists(),

  async (req, res) => {
    let sucess = false
    //if there are error in credentials Bad request will be sent
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({sucess, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        //if user doesn't exist with the email
        return res
          .status(400)
          .json({sucess,error:"Please try to login with correct credentials"});
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({sucess,error:"Please try to login with correct credentials"});
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      sucess = true
      const username = user.name
      res.json({username,sucess, authToken });
      // console.log(authToken)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ROUTE : 3  get logged in user details using POST "/api1/auth/getuser" loggin required

router.post(
  "/getuser",
  fetchuser,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
