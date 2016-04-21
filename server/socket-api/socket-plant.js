var db = require('db')
var socketServerUtil = require('socket-server-util')
var saveAddPlantDocument = require('documents/add-plant-saver')

var serializeErrorPassedToLastCallback = socketServerUtil.serializeErrorPassedToLastCallback
var callFunctionBeforeCallbackSync = socketServerUtil.callFunctionBeforeCallbackSync
var serializeErrorForCallback = socketServerUtil.serializeErrorForCallback

module.exports = function({ userId, accountId, tagScope }, socket, broadcast) {
	const plantDb = db.plant

	socket.on('load plant', serializeErrorPassedToLastCallback(plantDb.load))
	socket.on('save plant', function(plant, cb) {
		plantDb.save(plant, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedPlant) {
			socket.emit('saved plant', savedPlant)
			broadcast.toAccount('saved plant', savedPlant)
		}))
	})

	socket.on('save add plant document', serializeErrorPassedToLastCallback((addPlant, cb) => saveAddPlantDocument(userId, addPlant, cb)))

	socket.on('load plant by tag number', serializeErrorPassedToLastCallback((tagNumber, cb) => {
		plantDb.loadByTag({
			accountId,
			tagNumber,
			tagScope
		}, (err, plants) => {
			if (err) return cb(err)
			cb(null, plants[0])
		})
	}))
}
