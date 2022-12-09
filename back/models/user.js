const { Schema, model } = require("mongoose")

const schema = new Schema(
  {
    firstName: String,
    lastName: String,
    username: { type: String, required: true },
    chatId: { type: Number, required: true },
    messages: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["creator", "sweet", "family", "friend", "others"],
      default: "others",
    },
    created: String,
    // created: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

module.exports = model("User", schema)

