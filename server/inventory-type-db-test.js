var connectionPoolFactory = require('./connection-pool-factory')
var pool = connectionPoolFactory()

var inventoryTypeDb = require('./inventory-type-db')(pool)

// inventoryTypeDb.save({
// 	name: 'Orange',
// 	sellable: true,
// 	parentInventoryTypeId: 4,
// 	version: 0
// }, function(err, result) {
// 	err && console.error(err)
// 	console.log(result)
// })

inventoryTypeDb.load(function(err, data) {
	console.dir(data, { depth: null })
})
