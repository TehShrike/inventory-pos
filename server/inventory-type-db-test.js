var connectionPoolFactory = require('./connection-pool-factory')
var pool = connectionPoolFactory()

var inventoryTypeDb = require('./inventory-type-db')(pool)

// inventoryTypeDb.save({
// 	name: 'Shatter',
// 	sellable: true,
// 	parentId: 5,
// 	version: 0
// }, function(err, result) {
// 	err && console.error(err)
// 	console.log(result)
// })

inventoryTypeDb.load(function(err, data) {
	console.dir(data, { depth: null })
})
