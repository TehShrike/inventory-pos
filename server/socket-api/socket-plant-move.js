const db = require('db')
const plantMoveSaver = require('documents/plant-move-saver')
const { serializeErrorPassedToLastCallback, callFunctionBeforeCallbackSync, serializeErrorForCallback } = require('socket-server-util')

module.exports = function(context, socket, broadcast) {
	const plantMoveDb = db.plantMove

	socket.on('load plant move', serializeErrorPassedToLastCallback(plantMoveDb.load))
	socket.on('save plant move', function(plantMove, cb) {
		plantMoveDb.save(plantMove, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedPlantMove) {
			socket.emit('saved plant move', savedPlantMove)
			broadcast.toAccount('saved plant move', savedPlantMove)
		}))
	})
	socket.on('save plant move document', function(plantMoveDocument, cb) {
		plantMoveSaver({ ...context, plantMoveDocument }, serializeErrorForCallback(cb))
	})
}
