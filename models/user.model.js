const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minLength: 5,
    // maxLenth: 50,
    required: true,
    match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,50}$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /\S+@\S+\.\S+/,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now(),
  },
  UpdatedAt: {
    type: Date,
    default: Date.now(),
  },
  userType: {
    type: String,
    required: true,
    default: "customer",
    enum: ["customer", "admin", "engineer"],
  },
  userStatus: {
    type: String,
    required: true,
    default: "approved",
  },
  ticketsCreated : {
    type : [mongoose.Types.ObjectId],
    ref : "Ticket"
  },
  ticketsAssigned : {
    type : [mongoose.Types.ObjectId] , 
    ref  : "Ticket"
  }
});
UserSchema.pre("save", function (next) {
  const hashedPassword = bcrypt.hashSync(this.password, 11);
  this.password = hashedPassword;
  next();
});

module.exports = mongoose.model("User", UserSchema);
