const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const conversationSchema = mongoose.Schema(
  {
    between: {
      user1: {
        type: ObjectId,
        ref: "User",
        required: true,
      },
      user2: {
        type: ObjectId,
        ref: "User",
        required: true,
      },
    },
    uniqueId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      autoIndex: true,
    },
    conversation: [
      {
        from: {
          type: ObjectId,
          ref: "User",
          required: true,
        },
        date: {
          type: Date,
          required: true,
          trim: true,
        },
        messageBody: {
          type: String,
          required: true,
          trim: true,
          sparse: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
