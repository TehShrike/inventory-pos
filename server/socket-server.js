var fs = require('fs')

var socketHandlers = fs.readdirSync('server/socket-api')
	.filter(file => /^socket-.*\.js$/.test(file))
	.map(str => './socket-api/' + str)
	.map(require)

module.exports = function handleUserConnection(context, socket) {
	const userId = context.userId
	const accountId = context.userId
	const accountRoom = getAccountRoom(accountId)
	const userRoom = getUserRoom(userId)

	const broadcast = {
		toAccount: (key, value) => socket.broadcast.to(accountRoom).emit(key, value)
	}

	socket.join(accountRoom)
	socket.join(userRoom)

	socketHandlers.forEach(fn => fn(context, socket, broadcast))
}

function getAccountRoom(accountId) {
	return 'account:' + accountId
}

function getUserRoom(userId) {
	return 'user:' + userId
}
