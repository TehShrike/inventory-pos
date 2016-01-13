var makeInventoryDb = require('db/inventory-db')
var socketServerUtil = require('socket-server-util')

var serializeErrorPassedToLastCallback = socketServerUtil.serializeErrorPassedToLastCallback
var callFunctionBeforeCallbackSync = socketServerUtil.callFunctionBeforeCallbackSync
var serializeErrorForCallback = socketServerUtil.serializeErrorForCallback

module.exports = function(config, socket, broadcast) {
	var inventoryDb = makeInventoryDb(config.db)

	socket.on('load inventory', serializeErrorPassedToLastCallback(inventoryDb.load))
	socket.on('save inventory', function(inventory, cb) {
		inventoryDb.save(inventory, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedInventory) {
			socket.emit('saved inventory', savedInventory)
			broadcast.toAccount('saved inventory', savedInventory)
		}))
	})
}
