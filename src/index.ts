import http from 'http'
import { Server, Socket } from 'socket.io'

import app from './expressapp'
import DBSetup from './database/connect'

// Get a normalized Port
const normalizePort = (val: string) => {
	const port = parseInt(val, 10)

	if (isNaN(port)) {
		return val
	}
	if (port >= 0) {
		return port
	}
	return false
}
const port = normalizePort(process.env.PORT || '5000')
app.set('port', port)

// errorHandler TODO: fix error type:
const errorHandler = (error: { syscall: string; code: any }) => {
	if (error.syscall !== 'listen') {
		throw error
	}
	const address = server.address()
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges.')
			process.exit(1)
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.')
			process.exit(1)
		default:
			throw error
	}
}

const server = http.createServer(app)

// SocketIO setup and State
const io = new Server(server, {
	cors: {
		origin: '*'
	}
})

/**A Bi-Map for associating user ids and socket ids */
class BiMap {
	socketIds: { [key: string]: string } = {}
	userIds: { [key: string]: string } = {}

	set(socketId: string, userId: string): void {
		this.socketIds[socketId] = userId
		this.userIds[userId] = socketId
	}

	getBySocketId(k: string): string | undefined {
		return this.socketIds[k]
	}

	getByUserId(v: string): string | undefined {
		return this.userIds[v]
	}

	removeBySocketId(socketId: string): void {
		const userId = this.socketIds[socketId]
		if (userId) {
			delete this.socketIds[socketId]
			delete this.userIds[userId]
		}
	}

	removeByUserId(userId: string): void {
		const socketId = this.userIds[userId]
		if (socketId) {
			delete this.userIds[userId]
			delete this.socketIds[socketId]
		}
	}

	hasUserId(userId: string): boolean {
		return this.userIds[userId] !== undefined
	}
}

interface User {
	userId: string
}

type OnlineUsers = { [k: string]: User }

// a bi-map of user ID to socket ID.
// useful for knowing if a user is online
const userSockets = new BiMap()

// a map of user id to user details,
// useful for resolving user ids their names
const users: Map<string, User> = new Map()

function getOnlineUsers(): OnlineUsers {
	const onlineUsers: OnlineUsers = {}
	users.forEach((user, userId) => {
		if (userSockets.hasUserId(userId)) onlineUsers[userId] = user
	})

	return onlineUsers
}

io.on('connection', (socket: Socket) => {
	socket.on('join', userDeets => {
		console.log(`New Connection. Connection Id: ${socket.id}, User Id: ${userDeets.userId}`)
		users.set(userDeets.userId, userDeets)
		userSockets.set(socket.id, userDeets.userId)
		socket.broadcast.emit('online-users', getOnlineUsers())
	})

	// send back a list of all the online users
	socket.emit('online-users', getOnlineUsers())

	// sending a message for a user
	socket.on('message', message => {
		const receiverSocketId = userSockets.getByUserId(message.to)

		// we may want to report the delivery status of your message
		if (receiverSocketId) {
			console.log('receiver', receiverSocketId)
			console.log('sending a message:', message.text)
			io.to(receiverSocketId).emit('message', message)
		}
	})

	// update the online users when a user disconnects
	socket.on('disconnect', () => {
		console.log('a user disconnected')

		// remove the user socketid-userid pair
		userSockets.removeBySocketId(socket.id)

		socket.broadcast.emit('online-users', getOnlineUsers())
	})
})

// SERVER START UP
server.on('error', errorHandler).on('listening', printPort)

function printPort() {
	const address = server.address()
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
	console.log('Listening on ' + bind)
}

server.listen(port)
DBSetup()
