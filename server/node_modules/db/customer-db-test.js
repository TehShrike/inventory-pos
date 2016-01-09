var makeCustomerDb = require('db/customer-db')
var mysql = require('mysql')

var pool = mysql.createPool({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	database: 'pos'
})

var customerDb = makeCustomerDb(pool)

customerDb.save({
	customerId: 3,
	name: 'Another fellow',
	driversLicense: 'H4949490123',
	socialSecurity: '585-12-3394',
	phoneNumber: '',
	customerType: 'medical',
	version: 2
}, function(err, results) {
	err && console.error(err)

	console.log(results)
})
