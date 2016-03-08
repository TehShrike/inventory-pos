var db = require('db')
var socketServerUtil = require('socket-server-util')

var serializeErrorPassedToLastCallback = socketServerUtil.serializeErrorPassedToLastCallback
var callFunctionBeforeCallbackSync = socketServerUtil.callFunctionBeforeCallbackSync
var serializeErrorForCallback = socketServerUtil.serializeErrorForCallback

module.exports = function(context, socket, broadcast) {
	var inventoryDb = db.inventory

	socket.on('load inventory', serializeErrorPassedToLastCallback(inventoryDb.load))
	socket.on('save inventory', function(inventory, cb) {
		inventoryDb.save(inventory, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedInventory) {
			socket.emit('saved inventory', savedInventory)
			broadcast.toAccount('saved inventory', savedInventory)
		}))
	})
}
