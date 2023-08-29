import express from 'express'
import path from 'path'
import cors from 'cors'

import userRoute from './routes/user'
import postRoute from './routes/post'

const app = express()
app.use(
	cors({
		origin: '*'
	})
)

app.use(express.json()) // give access to the body

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', userRoute)
app.use('/api/post', postRoute)

export default app
