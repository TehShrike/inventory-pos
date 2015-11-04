module.exports = function(appContext) {
	var socket = appContext.socket

	appContext.mediator.provide('emitToServer', function() {
		socket.emit.apply(socket, arguments)
	})
}
