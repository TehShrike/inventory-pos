var db = require('db')
var socketServerUtil = require('socket-server-util')

var serializeErrorPassedToLastCallback = socketServerUtil.serializeErrorPassedToLastCallback
var callFunctionBeforeCallbackSync = socketServerUtil.callFunctionBeforeCallbackSync
var serializeErrorForCallback = socketServerUtil.serializeErrorForCallback

module.exports = function(config, socket, broadcast) {
	var roomDb = db.room

	socket.on('load rooms', serializeErrorPassedToLastCallback(roomDb.loadAll))
	socket.on('load room', serializeErrorPassedToLastCallback(roomDb.load))
	socket.on('save room', function(room, cb) {
		roomDb.save(room, callFunctionBeforeCallbackSync(serializeErrorForCallback(cb), function(savedRoom) {
			socket.emit('saved room', savedRoom)
			broadcast.toAccount('saved room', savedRoom)
		}))
	})
}
