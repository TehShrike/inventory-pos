var makeStrainDb = require('db/strain-db')
var socketServerUtil = require('socket-server-util')

var serializeErrorPassedToLastCallback = socketServerUtil.serializeErrorPassedToLastCallback
var callFunctionBeforeCallbackSync = socketServerUtil.callFunctionBeforeCallbackSync
var serializeErrorForCallback = socketServerUtil.serializeErrorForCallback

module.exports = function(config, socket, broadcast) {
	var strainDb = makeStrainDb(config.db)

	socket.on('load strains', serializeErrorPassedToLastCallback(strainDb.loadAll))
	socket.on('load strain', serializeErrorPassedToLastCallback(strainDb.load))
	socket.on('save strain', function(strain, cb) {
		strainDb.save(strain, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedStrain) {
			socket.emit('saved strain', savedStrain)
			broadcast.toAccount('saved strain', savedStrain)
		}))
	})
}
