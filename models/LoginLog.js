const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
    ip: String,
    username: String,
    status: String,
    attempts: Number,
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("LoginLog", loginSchema);