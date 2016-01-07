var makeCustomerDb = require('./db/customer-db')
var serializeUtil = require('./socket-server-util')

var serializeErrorPassedToLastCallback = serializeUtil.serializeErrorPassedToLastCallback
var callFunctionBeforeCallbackSync = serializeUtil.callFunctionBeforeCallbackSync
var serializeErrorForCallback = serializeUtil.serializeErrorForCallback

module.exports = function(config, socket, broadcast) {
	var customerDb = makeCustomerDb(config.db)

	socket.on('save customer', function handler(customer, cb) {
		customerDb.save(customer, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedCustomer) {
			broadcast.toAccount('saved customer', savedCustomer)
		}))
	})

	socket.on('load customer', serializeErrorPassedToLastCallback(customerDb.load))
	socket.on('customer search', serializeErrorPassedToLastCallback(customerDb.search))

}
