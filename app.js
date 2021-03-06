const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyPaser = require("body-parser");
const cors = require("cors")
const cookiesPaser = require("cookie-parser");
const expressValidator = require("express-validator");

require("dotenv").config();
//require router
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const categoryRouter = require("./routers/category");
const productRouter = require("./routers/product");
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
app.use(cors());

// router midleware
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);
//port
const port = process.env.POST || 5555;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
