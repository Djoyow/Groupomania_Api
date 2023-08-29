import { Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const User = new Schema({
	email: { type: String, required: true, unique: true },
	userName: { type: String, required: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, default: false }
})

User.plugin(uniqueValidator)
export default model('User', User)
