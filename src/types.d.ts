import { Request } from 'express'

declare global {
	namespace Express {
		namespace Groupomania {
			interface SessionData {
				userId: string
				isAdmin: boolean
			}
		}

		interface Request {
			auth?: Groupomania.SessionData
		}
	}
}
