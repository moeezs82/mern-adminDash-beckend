const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      maxLength: [30, "Name cannot exceed 30 charecters"],
      minLength: [4, "Name should have more than 5 charecters"],
    },
    email: {
      type: String,
      required: [true, "Please Enter your email"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minLength: [8, "Password should have at least 8 charecters"],
      select: false, //to not send in response if find method call
    },
    city: String,
    state: String,
    country: String,
    occupation: String,
    phoneNumber: String,
    transaction: Array,
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  //checking if password is not modified so not hash password again
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
