var socketStream = require('socket.io-stream')

var makeCustomerDb = require('./customer-db')
var makeInventoryTypeDb = require('./inventory-type-db')
var fileHelpers = require('./file-helpers')

var getFileStreamHandler = fileHelpers.getFileStreamHandler
var checkFileExists = fileHelpers.checkFileExists

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
		var inventoryTypeDb = makeInventoryTypeDb(db)

		socket.on('save customer', function handler(customer, cb) {
			customerDb.save(customer, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedCustomer) {
				broadcastToAccount('saved customer', savedCustomer)
			}))
		})

		socket.on('load customer', serializeErrorPassedToLastCallback(customerDb.load))
		socket.on('customer search', serializeErrorPassedToLastCallback(customerDb.search))

		socket.on('load inventory types', serializeErrorPassedToLastCallback(inventoryTypeDb.load))
		socket.on('save inventory type', function(inventoryType, cb) {
			inventoryTypeDb.save(inventoryType, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedInventoryType) {
				socket.emit('saved inventory type', savedInventoryType)
				broadcastToAccount('saved inventory type', savedInventoryType)
			}))
		})

		socket.on('drivers license exists', serializeErrorPassedToLastCallback(checkFileExists.bind(null, customerDriversLicenseDirectory)))
		socket.on('prescription exists', serializeErrorPassedToLastCallback(checkFileExists.bind(null, customerPrescriptionDirectory)))

		socketStream(socket).on('save drivers license', getFileStreamHandler(customerDriversLicenseDirectory, 'customerId'))
		socketStream(socket).on('save prescription', getFileStreamHandler(customerPrescriptionDirectory, 'customerId'))

		cb(null, {
			userId: userId,
			name: 'Totally cool user'
		})
	})

}

function serializeErrorPassedToLastCallback(fn) {
	return function() {
		var args = []
		for (var i = 0; i < arguments.length; ++i) {
			var finalArgCallback = (i === arguments.length - 1) && typeof arguments[arguments.length - 1] === 'function'
			args.push(finalArgCallback ? serializeErrorForCallback(arguments[i]) : arguments[i])
		}
		fn.apply(null, args)
	}
}

function serializeErrorForCallback(cb) {
	return function(err) {
		var args = []

		if (err) {
			var newErrorObject = {}
			Object.getOwnPropertyNames(err).forEach(function(key) {
				newErrorObject[key] = err[key]
			})
			args.push(newErrorObject)
		} else {
			args.push(null)
		}

		for (var i = 1; i < arguments.length; ++i) {
			args.push(arguments[i])
		}

		cb.apply(null, args)
	}
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
