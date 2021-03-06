var connectionPoolFactory = require('connection-pool-factory')
var pool = connectionPoolFactory()

var inventoryDb = require('db/inventory-db')(pool)

inventoryDb.save({
	inventoryId: 1,
	inventory_type_id: 14,
	quantity: 3,
	package_id: null,
	room_id: 2,
	version: 2
}, function(err, result) {
	if (err) {
		console.log(err.message || err)
	} else {
		console.log('inserted', result)
	}
})

inventoryDb.load(1, function(err, data) {
	console.dir(data, { depth: null })
})

// roomDb.loadAll(function(err, data) {
// 	console.dir(data)
// })
