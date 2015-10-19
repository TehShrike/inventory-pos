var makeCustomerDb = require('./customer-db')
var saveStream = require('./save-stream-to-file')
var socketStream = require('socket.io-stream')
var joinPath = require('path').join
var fs = require('fs')

module.exports = function handleUserConnection(config, socket) {
	var db = config.db
	var customerDriversLicenseDirectory = config.imageDirectories.customerDriversLicense
	var customerPrescriptionDirectory = config.imageDirectories.customerPrescription

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

		function getDriversLicensePath(customerId) {
			customerId = parseInt(customerId, 10).toString(10)
			return joinPath(customerDriversLicenseDirectory, customerId)
		}

		socket.on('drivers license exists', function(customerId, cb) {
			var filePath = getDriversLicensePath(customerId)

			fs.stat(filePath, function(err, stats) {
				if (err) {
					cb(null, false)
				} else {
					cb(null, stats.isFile())
				}
			})
		})

		socketStream(socket).on('save drivers license', function(stream, data, cb) {
			var filePath = getDriversLicensePath(data.customerId)
			saveStream({ stream: stream, filePath: filePath }, cb)
		})

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
