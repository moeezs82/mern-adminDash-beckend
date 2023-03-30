const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide a Name"],
    },
    price: {
      type: Number,
      required: [true, "Please Provide a Price for this Product"],
    },
    description: {
      type: String,
      required: [true, "Please Provide a Description for this Product"],
    },
    category: String,
    rating: Number,
    supply: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
