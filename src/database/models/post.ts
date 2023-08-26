import { Schema, model } from 'mongoose'

const Post = new Schema({
	userId: { type: String, require: true },
	imageUrl: { type: String, require: true },
	likes: { type: Number },
	usersLiked: [String],
	text: { type: String, require: true },
	createOne: { type: Date, default: Date.now }
})

export default model('Post', Post)
