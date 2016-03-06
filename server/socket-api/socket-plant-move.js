var makePlantMoveDb = require('db/plant-move-db')
var socketServerUtil = require('socket-server-util')

var serializeErrorPassedToLastCallback = socketServerUtil.serializeErrorPassedToLastCallback
var callFunctionBeforeCallbackSync = socketServerUtil.callFunctionBeforeCallbackSync
var serializeErrorForCallback = socketServerUtil.serializeErrorForCallback

module.exports = function(config, socket, broadcast) {
	var plantMoveDb = makePlantMoveDb(config.db)

	socket.on('load plant move', serializeErrorPassedToLastCallback(plantMoveDb.load))
	socket.on('save plant move', function(plantMove, cb) {
		plantMoveDb.save(plantMove, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedPlantMove) {
			socket.emit('saved plant move', savedPlantMove)
			broadcast.toAccount('saved plant move', savedPlantMove)
		}))
	})
}
