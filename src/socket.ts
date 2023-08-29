import { Server as HttpServer } from 'http'
import BiMap from 'lib/bimap'
import { Server, Socket } from 'socket.io'

namespace Models {
	export interface User {
		userId: string
		userName: string
	}
}

type OnlineUsers = { [k: string]: Models.User }

// a bi-map of socket ID to user ID.
// useful for knowing if a user is online
const userSockets = new BiMap<string>()

// a map of user id to user details,
// useful for resolving user ids their names
const users: Map<string, Models.User> = new Map()

function getOnlineUsers(): OnlineUsers {
	const onlineUsers: OnlineUsers = {}
	users.forEach((user, userId) => {
		if (userSockets.has(userId)) onlineUsers[userId] = user
	})

	return onlineUsers
}

function attachSocketHandlers(io: Server): (socket: Socket) => void {
	return function (socket: Socket): void {
		socket.on('join', userDeets => {
			console.log(`New Connection. Connection Id: ${socket.id}, User Id: ${userDeets.userId}`)
			users.set(userDeets.userId, userDeets)
			userSockets.assoc(socket.id, userDeets.userId)
			socket.broadcast.emit('online-users', getOnlineUsers())
		})

		// send back a list of all the online users
		socket.emit('online-users', getOnlineUsers())

		// sending a message for a user
		socket.on('message', message => {
			const receiverSocketId = userSockets.get(message.to)

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
			userSockets.deAssoc(socket.id)

			socket.broadcast.emit('online-users', getOnlineUsers())
		})
	}
}

export default function init(server: HttpServer): Server {
	// SocketIO setup and State
	const io: Server = new Server(server, {
		cors: {
			origin: '*'
		}
	})

	io.on('connection', attachSocketHandlers(io))

	return io
}
