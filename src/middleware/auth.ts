import { JwtPayload, verify } from 'jsonwebtoken'
import { Response, NextFunction, Request } from 'express'

function auth(req: Request, res: Response, next: NextFunction) {
	try {
		const token = req.headers.authorization?.split(' ')[1] || ''
		const decodedToken = verify(token, 'sss') as JwtPayload
		const userId = decodedToken.userId
		const isAdmin: boolean = decodedToken.isAdmin

		req.auth = {
			userId: userId,
			isAdmin: isAdmin
		}

		next()
	} catch (error) {
		res.status(401).json({ error })
	}
}

export default auth
