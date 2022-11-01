const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const User = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
})

User.plugin(uniqueValidator)
module.exports = mongoose.model('User', User)
