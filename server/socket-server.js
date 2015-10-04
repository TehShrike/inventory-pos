var makeCustomerDb = require('./customer-db')

module.exports = function handleUserConnection(db, socket) {
	var customerDb = makeCustomerDb(db)

	socket.on('save customer', function handler(customer, cb) {
		customerDb.save(customer, cb)
	})

	socket.on('load customer', customerDb.load)
	socket.on('customer search', customerDb.search)
}
