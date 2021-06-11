const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {type: String, required:true, unique: true},
    password: {type: String, required: true},
    roleId: {type: Number, required: true}
})

module.exports = user = mongoose.model("user", userSchema)
