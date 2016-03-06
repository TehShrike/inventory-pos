var fs = require('fs')

var socketHandlers = fs.readdirSync('server/socket-api')
	.filter(file => /^socket-.*\.js$/.test(file))
	.map(str => './socket-api/' + str)
	.map(require)

module.exports = function handleUserConnection(config, socket, broadcast) {
	socket.on('authenticate', function(userId, cb) {
		var accountId = getAccountId(userId)
		var accountRoom = getAccountRoom(accountId)
		var userRoom = getUserRoom(userId)

		var broadcast = {
			toAccount: (key, value) => socket.broadcast.to(accountRoom).emit(key, value)
		}

		socket.join(accountRoom)
		socket.join(userRoom)

		socketHandlers.forEach(fn => fn(config, socket, broadcast))


		cb(null, {
			userId: userId,
			name: 'Totally cool user'
		})
	})

}

function getAccountRoom(accountId) {
	return 'account:' + accountId
}

function getUserRoom(userId) {
	return 'user:' + userId
}

function getAccountId(userId) {
	return 123
}
