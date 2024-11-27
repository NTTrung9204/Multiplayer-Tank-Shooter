const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Chat = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    message: { type: String, required: true },
    time: { type: String, required: true, default: Date.now },
});

module.exports = mongoose.model("Chat", Chat);
