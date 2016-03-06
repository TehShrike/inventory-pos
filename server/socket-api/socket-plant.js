var makePlantDb = require('db/plant-db')
var socketServerUtil = require('socket-server-util')

var serializeErrorPassedToLastCallback = socketServerUtil.serializeErrorPassedToLastCallback
var callFunctionBeforeCallbackSync = socketServerUtil.callFunctionBeforeCallbackSync
var serializeErrorForCallback = socketServerUtil.serializeErrorForCallback

module.exports = function(config, socket, broadcast) {
	var plantDb = makePlantDb(config.db)

	socket.on('load plant', serializeErrorPassedToLastCallback(plantDb.load))
	socket.on('save plant', function(plant, cb) {
		plantDb.save(plant, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedPlant) {
			socket.emit('saved plant', savedPlant)
			broadcast.toAccount('saved plant', savedPlant)
		}))
	})
	socket.on('save add plant document', serializeErrorPassedToLastCallback(plantDb.saveAddPlantDocument))
}