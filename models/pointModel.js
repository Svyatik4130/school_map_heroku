const mongoose = require("mongoose")

const pointSchema = new mongoose.Schema({
    userEmail: {type: String, required:true},
    userID: {type: String, required:true},
    id: {type: Number, required: true},
    pointCoords: {type: Object, required: true},
    note: {type: String, required:true, minlength: 5}
})

module.exports = point = mongoose.model("point", pointSchema)
