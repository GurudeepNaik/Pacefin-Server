const express = require("express");
const user = require("../model/userModel");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.post("/register", body("password"), body("email").isEmail(), body("username"), async (req, res) => {
    try {
      const repeatedEmail = await user.find({ email: req.body.email });
      if (repeatedEmail.length === 0) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({
            status: "Failed By Validator",
            message: errors.array(),
          });
        } else {
          const { password, username, email } = req.body;
          const salt = await bcrypt.genSalt(12);
          bcrypt.hash(password, salt, async (err, hash) => {
            await data.create({
              email: email,
              password: hash,
              username: username,
            });
          });
          res.status(200).json({
            status: "Success",
            message: "Please Login",
          });
        }
      } else {
        res.status(400).json({
          status: "Failed",
          error: "User Already Exists",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "Failed",
        message: err.message,
      });
    }
  }
);

module.exports = router;
