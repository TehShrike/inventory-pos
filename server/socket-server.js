var makeCustomerDb = require('./customer-db')

module.exports = function handleUserConnection(db, socket) {

	socket.on('authenticate', function(userId, cb) {
		var accountId = getAccountId(userId)
		var accountRoom = getAccountRoom(accountId)
		var userRoom = getUserRoom(userId)

		function broadcastToAccount(key, value) {
			socket.broadcast.to(accountRoom).emit(key, value)
		}

		socket.join(accountRoom)
		socket.join(userRoom)

		var customerDb = makeCustomerDb(db)

		socket.on('save customer', function handler(customer, cb) {
			customerDb.save(customer, callFunctionBeforeCallbackSync(cb, function(savedCustomer) {
				broadcastToAccount('saved customer', savedCustomer)
			}))
		})

		socket.on('load customer', customerDb.load)
		socket.on('customer search', customerDb.search)

		cb(null, {
			userId: userId,
			name: 'Totally cool user'
		})
	})

}

function callFunctionBeforeCallbackSync(cb, fn) {
	return function(err, value) {
		if (err) {
			cb(err)
		} else {
			fn(value)
			cb(err, value)
		}
	}
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
