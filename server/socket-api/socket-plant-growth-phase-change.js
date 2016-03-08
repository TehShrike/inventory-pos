var db = require('db')
var socketServerUtil = require('socket-server-util')

var serializeErrorPassedToLastCallback = socketServerUtil.serializeErrorPassedToLastCallback
var callFunctionBeforeCallbackSync = socketServerUtil.callFunctionBeforeCallbackSync
var serializeErrorForCallback = socketServerUtil.serializeErrorForCallback

module.exports = function(context, socket, broadcast) {
	var plantGrowthPhaseChangeDb = db.plantGrowthPhaseChange

	socket.on('load plant growth phase change', serializeErrorPassedToLastCallback(plantGrowthPhaseChangeDb.load))
	socket.on('save plant growth phase change', function(plantGrowthPhaseChange, cb) {
		plantGrowthPhaseChangeDb.save(plantGrowthPhaseChange, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedPlant) {
			socket.emit('saved plant growth phase change', savedPlant)
			broadcast.toAccount('saved plant growth phase change', savedPlant)
		}))
	})
}
