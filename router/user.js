const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../model/userSchema.js");
const auth = require("../middleware/auth.js");

router.post("/user/register", async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  const profileImage =
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw3scIeyL6BNgrYzTMy9L4Mu&ust=1705519811815000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCMiQnL7S4oMDFQAAAAAdAAAAABAI";
  if (!name || !email || !password || !cpassword) {
    return res.status(422).json({ error: "plz fill the fields properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      res.status(422).json({ success: false, error: "Email already Exist" });
    } else if (password != cpassword) {
      res
        .status(422)
        .json({ success: false, error: "passwords doesn't match" });
    } else {
      const user = new User({ name, email, password, cpassword, profileImage });
      await user.save();
      res
        .status(201)
        .json({ success: true, message: "user Registered Successfully", user });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Plz fill all the fields" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      const token = await userLogin.generateAuthToken();
      res.cookie("jwtToken", token, {
        expires: new Date(Date.now() + 2592000000),
        httpOnly: false,
        secure: true,
        sameSite: "None",
      });

      if (isMatch) {
        const user = await User.findOne({ email: email });
        res.status(201).json({ message: "User signin successful", user });
      } else {
        res
          .status(400)
          .json({ error: "Password doesn't Match) Invalid Credentials !!!" });
      }
    } else {
      res
        .status(400)
        .json({ error: "(Email doesn't exist) Invalid Credentials !!!" });
    }
  } catch (err) {}
});

router.get("/user/check", auth, async (req, res) => {
  try {
    if (req.user) {
      res.send({
        success: true,
        user: req.user,
      });
    } else {
      res.status(400).send({
        success: false,
        user: {},
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/user/logout", auth, async (req, res) => {
  try {
    // res.clearCookie("jwtToken");
    console.log("logout");
    res.clearCookie("jwtToken", { domain: "http://localhost:3000", path: "/", secure: true, httpOnly: false });
    console.log("finish logout");
    const user= await req.user.save();
    console.log(user);
    // res.cookie("jwtToken", null, {
    //   expires: new Date(Date.now()),
    //   httpOnly: true,
    // });
    res.send({
      message: "loggedOut",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/user/update/:id", auth, async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Blogs not Found",
      });
    }
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      useFindAndModify: false,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "user updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/user/allUsers", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({ success: true, users });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
