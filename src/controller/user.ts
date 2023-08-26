import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { hash as _hash, compare } from 'bcrypt'
import passwordValidator from 'password-validator'
import { validate } from 'email-validator'

import UserModel from '../database/models/user'

interface AuthReqBody {
	email: string
	password: string
}

export function signup(req: Request, res: Response) {
	// Create a schema
	var schema = new passwordValidator()

	// Add properties to it
	schema
		.is()
		.min(8) // Minimum length 8
		.is()
		.max(100) // Maximum length 100
		.has()
		.uppercase() // Must have uppercase letters
		.has()
		.lowercase() // Must have lowercase letters
		.has()
		.digits(1) // Must have at least 1 digits
		.has()
		.not()
		.spaces() // Should not have spaces
		.has()
		.symbols() // Must have symbols

	const body = req.body as AuthReqBody | null

	if (body !== null && !schema.validate(body.password)) {
		res.status(401).json({ message: 'Mot de passe incorrect' })
	} else if (!validate(req.body.email)) {
		res.status(401).json({ message: 'email incorrect' })
	} else {
		_hash(req.body.password, 10)
			.then(hash => {
				const user = new UserModel({ email: req.body.email, password: hash, userName: req.body.userName })

				user.save()
					.then(user => {
						res.status(201).json({ message: 'user creat successfully' })
					})
					.catch(e => {
						res.status(400).json({ e })
					})
			})
			.catch(e => {
				res.status(500).json({ e })
			})
	}
}

export function login(req: Request, res: Response) {
	const body = req.body as AuthReqBody
	UserModel.findOne({ email: body.email })
		.then(user => {
			if (user) {
				compare(body.password, user.password || '').then(result => {
					if (result) {
						res.status(200).json({
							userName: user.userName,
							userId: user._id,
							isAdmin: user.isAdmin,
							token: sign({ userId: user._id, isAdmin: user.isAdmin }, 'sss', { expiresIn: '30 days' })
						})
					} else res.status(401).json({ message: 'Identifiants incorrects' })
				})
			} else {
				res.status(401).json({ message: 'email ou mot de passe incorrect' })
			}
		})
		.catch(e => {
			res.status(500).json({ e })
		})
}

export function getUserName(req: Request, res: Response) {
	UserModel.findOne({ _id: req.params.userId })
		.then(user => {
			res.status(200).json(user ? user.userName : 'anonyme')
		})
		.catch(error => {
			console.log('error:', error)
			res.status(400).json({ error })
		})
}
export function getUserList(req: Request, res: Response) {
	UserModel.find()
		.then(users => {
			res.status(200).json(users)
		})
		.catch(error => {
			console.log('error:', error)
			res.status(400).json({ error })
		})
}
