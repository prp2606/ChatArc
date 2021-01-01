const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    salt: String,
    contactList: [
      {
        petName: {
          type: String,
          required: true,
          trim: true,
          maxlength: 32,
          sparse: true,
        },
        actualUser: {
          type: ObjectId,
          ref: "User",
          required: true,
          sparse: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encryptedPassword = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainPassword) {
    if (this.securePassword(plainPassword) === this.encryptedPassword) {
      return true;
    } else {
      return false;
    }
  },

  securePassword: function (plainPassword) {
    if (!plainPassword) {
      return "";
    }
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
