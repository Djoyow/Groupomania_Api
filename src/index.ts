import http from 'http'
import socketSetup from './socket'

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
socketSetup(server)

// SERVER START UP
server.on('error', errorHandler).on('listening', printPort)

function printPort() {
	const address = server.address()
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
	console.log('Listening on ' + bind)
}

server.listen(port)
DBSetup()
