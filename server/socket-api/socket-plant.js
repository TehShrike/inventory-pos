var db = require('db')
var socketServerUtil = require('socket-server-util')
var saveAddPlantDocument = require('documents/add-plant')

var serializeErrorPassedToLastCallback = socketServerUtil.serializeErrorPassedToLastCallback
var callFunctionBeforeCallbackSync = socketServerUtil.callFunctionBeforeCallbackSync
var serializeErrorForCallback = socketServerUtil.serializeErrorForCallback

module.exports = function(context, socket, broadcast) {
	const plantDb = db.plant
	const accountId = context.accountId

	socket.on('load plant', serializeErrorPassedToLastCallback(plantDb.load))
	socket.on('save plant', function(plant, cb) {
		plantDb.save(plant, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedPlant) {
			socket.emit('saved plant', savedPlant)
			broadcast.toAccount('saved plant', savedPlant)
		}))
	})

	socket.on('save add plant document', serializeErrorPassedToLastCallback((addPlant, cb) => saveAddPlantDocument(context.userId, addPlant, cb)))

	socket.on('load plant by tagNumber', serializeErrorPassedToLastCallback((tagNumber, cb) => {
		plantDb.loadByTag({
			accountId,
			tagNumber
		}, cb)
	}))
}
