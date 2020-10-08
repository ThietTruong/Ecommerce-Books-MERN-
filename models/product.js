const moongosse = require("mongoose");
const { body } = require("express-validator/check");
const { ObjectId } = moongosse.Schema;

const productSchema = moongosse.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlenght: 32,
    },
    description: {
      type: String,
      required: true,
      maxlenght: 2000,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlenght: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
    },
    photo: {
      type: Buffer,
      contenType: String,
    },
    shipping: {
      required: false,
      type: Boolean,
    },
  },
  { timestampes: true }
);

module.exports = moongosse.model("Product", productSchema);
