const express = require("express");
const user = require("../model/userModel");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();
const secret = "SECRET";

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
            await user.create({
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

router.post("/login", body("email").isEmail(), body("username"), async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({
          status: "Failed By Validator",
          message: errors.array(),
        });

      } else {
        if (req.body.isGoogleLoggedIn) {
          const { email, username } = req.body;
          const isUserhasAccount = await user.findOne({ email: email });

          if (isUserhasAccount === null) {
            await user.create({
              email: email,
              username: username,
            });
          }
          const userData = await user.findOne({ email: email });
          const token = jwt.sign({ exp: Math.floor(Date.now() / 10) + 60 * 60, data: userData._id }, secret);

          res.status(200).json({
            Status: "Successful",
            token: token,
          });

        } else {
          const { email, password } = req.body;
          const userData = await user.findOne({ email: email });

          if (userData != null) {
            const result = await bcrypt.compare(password, userData.password);

            if (result) {
              const token = jwt.sign({ exp: Math.floor(Date.now() / 10) + 60 * 60, data: userData._id }, secret);

              res.status(200).json({
                Status: "Successful",
                token: token,
              });

            } else {
              res.status(400).json({
                status: "failed",
                message: "Wrong Password",
              });

            }
          } else {
            res.status(400).json({
              status: "failed",
              message: "No user Found",
            });

          }
        }
      }
    } catch (error) {
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
      
    }
  }
);

module.exports = router;
