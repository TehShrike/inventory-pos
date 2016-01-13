var makeInventoryTypeDb = require('db/inventory-type-db')
var socketServerUtil = require('socket-server-util')

var serializeErrorPassedToLastCallback = socketServerUtil.serializeErrorPassedToLastCallback
var callFunctionBeforeCallbackSync = socketServerUtil.callFunctionBeforeCallbackSync
var serializeErrorForCallback = socketServerUtil.serializeErrorForCallback

module.exports = function(config, socket, broadcast) {
	var inventoryTypeDb = makeInventoryTypeDb(config.db)

	socket.on('load inventory types', serializeErrorPassedToLastCallback(inventoryTypeDb.load))
	socket.on('save inventory type', function(inventoryType, cb) {
		inventoryTypeDb.save(inventoryType, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedInventoryType) {
			socket.emit('saved inventory type', savedInventoryType)
			broadcast.toAccount('saved inventory type', savedInventoryType)
		}))
	})

	socket.on('load top level plants', serializeErrorPassedToLastCallback(function(cb) {
		inventoryTypeDb.load(q => q.where('parent_inventory_type_id', null).where('plant', true), cb)
	}))

	socket.on('load child plants', serializeErrorPassedToLastCallback(function(inventoryTypeId, cb) {
		inventoryTypeDb.load(q => q.where('parent_inventory_type_id', inventoryTypeId)
			.where('plant', true), cb)
	}))

}
