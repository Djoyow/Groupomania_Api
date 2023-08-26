import { Request, Response, Express } from 'express'
import PostModel from '../database/models/post'
import { saveImage as _saveImage } from '../middleware/cloudinary'

export function getPostes(req: Request, res: Response) {
	PostModel.find({})
		.then(posts => res.status(200).json(posts))
		.catch(error => res.status(400).json({ error }))
}

export function getOnePost(req: Request, res: Response) {
	PostModel.findOne({ _id: req.params.id })
		.then(post => res.status(200).json(post))
		.catch(error => res.status(400).json({ error }))
}

export function creatPost(req: Request, res: Response) {
	let text = ''
	let imageUrl = ''

	try {
		let data = JSON.parse(req.body.json)
		text = data.text
		if (req.file) {
			// imageUrl= `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
		}

		if (!text) {
			return res.status(400).json({ message: 'bad request' })
		}
	} catch (error) {
		return res.status(400).json(error)
	}

	const auth = req.auth as Express.Groupomania.SessionData

	const post = new PostModel({
		text,
		userId: auth.userId,
		imageUrl:
			/*"https://res.cloudinary.com/dkdwhd7hl/image/upload/v1668873640/Groupomania/posts/post_" +postId+"."+*/ req.file?.mimetype.split(
				'/'
			)[1]

		// imageUrl:imageUrl
	})

	return post
		.save()
		.then(post => {
			// Save image on cloudinary
			if (req.file)
				_saveImage(req.file, post._id.toString())
					.then(() => {
						res.status(201).json({ message: 'Post save successfully' })
					})
					.catch((e: Error) => res.status(400).json({ e }))
		})
		.catch(e => res.status(400).json({ e }))
}

export function updatePost(req: Request, res: Response) {
	let data = JSON.parse(req.body.json)
	let text = data.text
	let postId = req.params.id

	if (text == null && !req.file) {
		res.status(400).json({ message: 'bad request' })
	} else {
		const auth = req.auth as Express.Groupomania.SessionData
		PostModel.findOne({ _id: req.params.id })
			.then(post => {
				// Check if user is admin or author
				if (post && post.userId != auth.userId && !auth.isAdmin) {
					res.status(401).json({ message: 'Unauthorized' })
				} else {
					// Get Object details
					const postObject = req.file
						? {
								text: text,
								imageUrl:
									/*"https://res.cloudinary.com/dkdwhd7hl/image/upload/v1668873640/Groupomania/posts/post_" +postId+"."+*/ req.file.mimetype.split(
										'/'
									)[1]
								// imageUrl= `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
						  }
						: { text: text }

					PostModel.updateOne({ _id: req.params.id }, postObject)
						.then(post => {
							// Save image on cloudinary
							if (req.file) {
								_saveImage(req.file, postId)
									.then(() => {
										res.status(201).json({ message: 'Post updated successfully' })
									})
									.catch((e: Error) => res.status(400).json({ e }))
							} else {
								res.status(201).json({ message: 'Post updated successfully' })
							}
						})
						.catch(e => {
							res.status(500).json({ e })
						})
				}
			})
			.catch(e => res.status(400).json({ e }))
	}
}

export function deletePost(req: Request, res: Response) {
	const auth = req.auth as Express.Groupomania.SessionData
	PostModel.findOne({ _id: req.params.id })
		.then(post => {
			if (!post) {
				res.status(401).json({ message: 'bad  request' })
			}

			// Check if user is admin or author
			else if (post.userId != auth.userId && !auth.isAdmin) {
				res.status(401).json({ message: 'Unauthorized' })
			}

			//TODO: delete the image firts
			else {
				PostModel.deleteOne({ _id: req.params.id })
					.then(() => {
						res.status(200).json({ message: 'post deleted successfully' })
					})
					.catch((e: Error) => res.status(400).json({ e }))
			}
		})
		.catch(e => {
			res.status(400).json({ e })
		})
}

export function likePost(req: Request, res: Response) {
	const auth = req.auth as Express.Groupomania.SessionData

	PostModel.findOne({ _id: req.query.id })
		.then(post => {
			// TODO Correct this one update function
			if (!post) {
				res.status(400).json({ message: 'bad request' })
			} else {
				let reqUserId = auth.userId

				const updateLikes = (usersLiked: string[]) => {
					post.likes = post.usersLiked.length
					post.usersLiked = usersLiked

					PostModel.updateOne({ _id: req.query.id }, post)
						.then(() => {
							res.status(200).json({ message: 'your request has been registered' })
						})
						.catch(e => {
							res.status(401).json({ e })
						})
				}

				const isAlreadyLiked = post.usersLiked.includes(reqUserId)

				if (req.query.like === '1' && !isAlreadyLiked) {
					post.usersLiked.push(reqUserId)
					updateLikes([...post.usersLiked, reqUserId])
				} else if (req.query.like === '0' && isAlreadyLiked) {
					updateLikes(post.usersLiked.filter(el => el !== reqUserId))
				} else {
					res.status(400).json({ message: 'bad request' })
				}
			}
		})
		.catch(e => {
			res.status(400).json({ e })
		})
}
