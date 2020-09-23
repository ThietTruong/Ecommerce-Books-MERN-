const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const user = require("../models/user");

exports.signup = (req, res) => {
  console.log("req.body: ", req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user,
    });
  });
};
exports.signin = async (req, res) => {
  // find the user base on email
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "user with that email does not exits. Please signup." });
    }
    const paws = user.encryptPassword(password);
    if (paws !== user.hashed_password) {
      return res.status(401).json({
        error: "Email and password don't match!!!",
      });
    }
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //persit the tokent as "t" in cookies with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // response with user and token to frontend client
    const { _id, name, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  } catch (err) {
    res.json({ daubuoi: "dit e may" });
  }

  // User.findOne({ email }, (err, user) => {
  //   console.log(err);
  //   if (err || !user) {
  //     return res
  //       .status(400)
  //       .json({ error: "User with that email does not exits. Please signup." });
  //   }
  //   // if user is found make sure the email and password math
  //   //create authenticate method is user model
  //   if (!user.errorHandler(password)) {
  //     return res.status(401).json({
  //       error: "Email and password don't match!!!",
  //     });
  //   }
  //   const token = jwt.sign({ _id: user._id }, process.env.JWR_SECRET);
  //   //persit the tokent as "t" in cookies with expiry date
  //   res.cookies("t", token, { expire: new Date() + 9999 });
  //   // response with user and token to frontend client
  //   const { _id, name, email, role } = user;
  //   return res.json({ token, user: { _id, name, email, role } });
  // });
  // generete a signed token with user id and secret
};
exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout success." });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});
exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({ error: "Access denied." });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res
      .status(403)
      .json({ error: " Admin resource !!! access denied." });
  }
  next();
};
