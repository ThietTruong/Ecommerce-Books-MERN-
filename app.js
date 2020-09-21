const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyPaser = require("body-parser");
const cookiesPaser = require("cookie-parser");
const expressValidator = require("express-validator");

require("dotenv").config();
//require router
const useRouter = require("./routers/user");

//app
const app = new express();
//db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database is conected");
  });
//midlewate
app.use(morgan("dev"));
app.use(bodyPaser.json());
app.use(cookiesPaser());
app.use(expressValidator());

// router midleware
app.use("/api", useRouter);
//port
const port = process.env.POST || 5555;
app.get("/", (req, res) => res.send("hello world"));
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
