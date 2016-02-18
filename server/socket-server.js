var socketHandlers = [
	'socket-customer',
	'socket-file',
	'socket-inventory-type',
	'socket-inventory',
	'socket-plant-growth-phase-change',
	'socket-plant-move',
	'socket-plant',
	'socket-room',
	'socket-strain'
].map(str => 'socket-api/' + str).map(require)

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
